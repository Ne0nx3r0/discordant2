import BattleTemporaryEffectPoison from '../BattleTemporaryEffectPoison';
import EffectId from '../EffectId';
import BattleTemporaryEffect from '../BattleTemporaryEffect';

export const EffectPrayer = new BattleTemporaryEffect({
    id: EffectId.Prayer,
    title: 'Prayer',
    onRoundBegin: function(bag){
        let hpHealed = Math.min(15,bag.target.stats.hpTotal-bag.target.hpCurrent);

        bag.target.hpCurrent += hpHealed;

        bag.sendBattleEmbed([`+ Prayer heals ${bag.target.title} +${hpHealed}HP`]);
    }
})