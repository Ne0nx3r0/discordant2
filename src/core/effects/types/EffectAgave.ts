import BattleTemporaryEffect from '../BattleTemporaryEffect';
import EffectId from '../EffectId';
import { Attribute } from '../../creature/AttributeSet';
import BattleTemporaryEffectAttributeBoost from '../BattleTemporaryEffectStatsBoost';

export const EffectAgave = new BattleTemporaryEffect({
    id: EffectId.Agave,
    title: `Agave`,
    onAddBonuses:function(stats){
        stats.resistances.physical += 5;
        stats.resistances.fire += 5;
    }
})