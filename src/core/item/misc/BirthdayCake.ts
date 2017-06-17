import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import ItemUsable from '../ItemUsable';
import PlayerCharacter from '../../creature/player/PlayerCharacter';
import WishCalc from '../../../bot/commands/WishCalc';

export const BirthdayCake = new ItemUsable({
    id: ItemId.BirthdayCake,
    title: 'Birthday Cake',
    description: `(Fully heals party and during battle revives defeated party members)\n\nWhat day is today? It's your own birthday! What a day for a birthday, let's all have some cake!`,
    goldValue: 100,
    battleExhaustion: 1,
    canUseInbattle: true,
    canUseInParty: true,
    canUse: function(user:PlayerCharacter,target:PlayerCharacter){
        let canHealSomeone = false;

        if(!target.party){
            if(target.hpCurrent >= target.stats.hpTotal){
                throw `${target.title}'s HP is full already`;
            }
        }
        else{
            target.party.members.forEach(function(member){
                if(member.hpCurrent < member.stats.hpTotal){
                    canHealSomeone = true;
                }
            });
            if(!canHealSomeone){
                throw `Your party has full hp already!`;
            }
        }
    },
    onUse: function(user:PlayerCharacter,target:PlayerCharacter):string{
        if(!target.party){
            target.hpCurrent = target.stats.hpTotal;

            return `${target.title} ate delicious cake and healed to full HP!`;
        }
        else{
            if(target.battle){
                const targetParticipant = target.battle.participantsLookup.get(target);
                const targetTeam = targetParticipant.teamNumber;

                target.battle.participants.forEach(function(p){
                    if(p.teamNumber == targetTeam){
                        if(p.defeated){
                            target.battle.revive(p.creature,p.creature.stats.hpTotal);
                        }
                        else{
                            p.creature.hpCurrent = p.creature.stats.hpTotal;
                        }
                    }
                });
            }
            else{
                target.party.members.forEach(function(member){
                    member.hpCurrent = member.stats.hpTotal;
                });
            }

            return `${target.title} shared delicious cake with the party! The party is fully healed!`;
        }
    }
});