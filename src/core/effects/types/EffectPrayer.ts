import BattleTemporaryEffectPoison from '../BattleTemporaryEffectPoison';
import EffectId from '../EffectId';
import BattleTemporaryEffect from '../BattleTemporaryEffect';

export const EffectPrayer = new BattleTemporaryEffect({
    id: EffectId.Prayer,
    title: 'Prayer',
    onRoundBegin: (e)=>{
        let hpHealed = Math.min(15,e.target.stats.hpTotal-e.target.hpCurrent);

        e.target.hpCurrent += hpHealed;

        e.battle.queueBattleMessage([`+ Prayer heals ${e.target.title} +${hpHealed}HP`]);
    },
    onRemoved: (e)=>{
        e.battle.queueBattleMessage([
            `${e.target.title}'s prayer effect wore off`
        ]);
    },
});