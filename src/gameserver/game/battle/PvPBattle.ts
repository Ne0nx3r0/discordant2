const INACTIVE_ROUNDS_BEFORE_CANCEL_BATTLE = 10;

export default class PvPBattle extends PlayerBattle{
    bpc1:IBattlePlayerCharacter;
    bpc2:IBattlePlayerCharacter;

    constructor(id:number,channel:DiscordTextChannel,pc1:PlayerCharacter,pc2:PlayerCharacter){
        super(id,channel,[pc1,pc2]);

        this.bpc1 = this.bpcs.get(pc1);
        this.bpc2 = this.bpcs.get(pc2);

        setTimeout(this.tick.bind(this),ATTACK_TICK_MS);
    }

    tick(){
        if(this.lastActionRoundsAgo >= INACTIVE_ROUNDS_BEFORE_CANCEL_BATTLE){
            this.expireBattle();

            return;
        }
        
        this.lastActionRoundsAgo++;

        if(this._battleEnded){
            return;
        }

//sort attackers and send any queued attacks
        const orderedAttacks = [this.bpc1,this.bpc2].sort(whoGoesFirst);
        const bpc1 = orderedAttacks[0];
        const bpc2 = orderedAttacks[1];

//Dispatch round begin
        const eventData:IBattleRoundBeginEvent = {
            battle:this
        };

        this.dispatch(BattleEvent.RoundBegin,eventData);

//Run any temporary effects onRoundBegin
        orderedAttacks.forEach((bpc:IBattlePlayerCharacter)=>{
            bpc.pc._tempEffects.forEach((roundsLeft:number,effect:BattleTemporaryEffect)=>{
                if(!this._battleEnded && effect.onRoundBegin){
                    effect.onRoundBegin({
                        target: bpc.pc,
                        sendBattleEmbed: this.sendEffectApplied,
                    });

                    if(bpc.pc.HPCurrent<1){
                        this.endBattle(bpc==bpc1?bpc2:bpc1,bpc);
                    }
                }

                if(roundsLeft==1){
                    bpc.pc._removeTemporaryEffect(effect);

                    if(effect.onRemoved){
                        effect.onRemoved({
                            target: bpc.pc,
                            sendBattleEmbed: this.sendEffectApplied,
                        });
                    }
                }
                else{
                    bpc.pc._tempEffects.set(effect,roundsLeft-1);
                }
            });
        });
        
        if(this._battleEnded) return;

        if(bpc1.queuedAttacks.length>0){
            const attackStep = bpc1.queuedAttacks.shift();

            this._sendAttackStep(bpc1,attackStep);
        }
        
        if(this._battleEnded) return;

        if(bpc2.queuedAttacks.length>0){
            const attackStep = bpc2.queuedAttacks.shift();

            this._sendAttackStep(bpc2,attackStep);
        }
        
        if(this._battleEnded) return;

        this.bpcs.forEach(function(bpc){
            if(bpc.exhaustion>0){
                bpc.exhaustion--;
            }
            if(bpc.blocking){
                bpc.blocking = false;
            }
        });

//schedule next tick if appropriate
        if(!this._battleEnded){
            setTimeout(this.tick.bind(this),ATTACK_TICK_MS);
        }
    }

    _sendAttackStep(attacker:IBattlePlayerCharacter,step:WeaponAttackStep){
        let defender:IBattlePlayerCharacter;

        this.bpcs.forEach(function(bpc:IBattlePlayerCharacter){
            if(bpc.pc.uid != attacker.pc.uid){
                defender = bpc;
            }
        });

        const damages:IDamageSet = step.getDamages({
            attacker:attacker.pc,
            defender:defender.pc,
            battle:this,
        });

        let attackCancelled = false;

        attacker.pc._tempEffects.forEach((rounds:number,effect:BattleTemporaryEffect)=>{
            if(effect.onAttack && !effect.onAttack({
                target:attacker.pc,
                sendBattleEmbed:this.sendEffectApplied
            },damages)){
                attackCancelled = true;
            };
        });

        if(attacker.pc.HPCurrent<1){
            this.endBattle(defender,attacker);
        }

        if(attackCancelled){
            return;
        }

        defender.pc._tempEffects.forEach((rounds:number,effect:BattleTemporaryEffect)=>{
            if(effect.onAttacked && !effect.onAttacked({
                target:defender.pc,
                sendBattleEmbed:this.sendEffectApplied
            },damages)){
                attackCancelled = true;
            };
        });

        if(defender.pc.HPCurrent<1){
            this.endBattle(attacker,defender);
        }

        if(attackCancelled){
            return;
        }

        attacker.exhaustion += step.exhaustion;

        defender.pc.HPCurrent -= Math.round(damagesTotal(damages));

        const bpc1EventData:IBattleAttackEvent = {
            attacker:attacker.pc,
            battle:this,
            message:step.attackMessage
                .replace('{attacker}',attacker.pc.title)
                .replace('{defender}',defender.pc.title),
            attacked: [{
                creature: defender.pc,
                damages: damages,
                blocked: defender.blocking,
                exhaustion: defender.exhaustion,
            }],
        };

        this.dispatch(BattleEvent.Attack,bpc1EventData);

        if(defender.pc.HPCurrent<1){
            this.endBattle(attacker,defender);
        }
    }

    endBattle(winner:IBattlePlayerCharacter,loser:IBattlePlayerCharacter){
        const eventData:IPvPBattleEndEvent = {
            battle: this,
            winner: winner,
            loser: loser,
        };

        this.dispatch(BattleEvent.PvPBattleEnd,eventData);

        this.cleanupBattle();
    }

    expireBattle(){
        const eventData:IPvPBattleExpiredEvent = {
            battle: this,
        };

        this.dispatch(BattleEvent.PvPBattleExpired,eventData);

        this.cleanupBattle();
    }

    cleanupBattle(){
        this._battleEnded = true;

        this.bpcs.forEach(function(bpc){
            bpc.pc.battle = null;
            bpc.pc.status = 'inCity';
            bpc.pc._clearTemporaryEffects();
            bpc.pc.HPCurrent = bpc.pc.stats.HPTotal;
        });

        setTimeout(()=>{
            this.channel.delete();
        },60000);
    }
}

//Lowest exhaustion or random agility-based goes first
function whoGoesFirst(a:IBattlePlayerCharacter,b:IBattlePlayerCharacter){
    if(a.exhaustion == b.exhaustion){
        return b.pc.stats.Agility * Math.random() - a.pc.stats.Agility * Math.random();
    }

    return a.exhaustion - b.exhaustion;
}