import BattleTemporaryEffectPoison from '../BattleTemporaryEffectPoison';
import EffectId from '../EffectId';
import BattleTemporaryEffect from '../BattleTemporaryEffect';

export const TOXIC_SPORES_ROUNDS = 6;

export const EffectToxicSporePoison = new BattleTemporaryEffect({
    id: EffectId.ToxicSporePoison,
    title: 'Toxic Spore Poison',
    onRoundBegin:(e)=>{
        const damage = Math.abs(e.roundsLeft - TOXIC_SPORES_ROUNDS) * 5;

        e.target.hpCurrent -= damage;

        e.battle.queueBattleMessage([`- (toxin intensifies) ${e.target.title} ${e.target.hpCurrent}/${e.target.stats.hpTotal} lost ${damage}HP from toxic spores eating away at them`]);
    }
});