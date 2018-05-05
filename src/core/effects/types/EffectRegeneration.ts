import BattleTemporaryEffectPoison from '../BattleTemporaryEffectPoison';
import EffectId from '../EffectId';
import BattleTemporaryEffect from '../BattleTemporaryEffect';

const REGEN_AMOUNT:number = 5;

export const EffectRegeneration = new BattleTemporaryEffect({
    id: EffectId.Regeneration,
    title: 'Regeneration',
    onRoundBegin: function(e){
        let hpHealed = Math.min(REGEN_AMOUNT,e.target.stats.hpTotal-e.target.hpCurrent);

        e.target.hpCurrent += hpHealed;

        e.battle.queueBattleMessage([`+ ${e.target.title} regenerated +${hpHealed}HP`]);
    }
});