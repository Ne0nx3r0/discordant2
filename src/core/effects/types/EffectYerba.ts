import BattleTemporaryEffect from '../BattleTemporaryEffect';
import EffectId from '../EffectId';
import { Attribute } from '../../creature/AttributeSet';
import BattleTemporaryEffectAttributeBoost from '../BattleTemporaryEffectStatsBoost';

export const EffectYerba = new BattleTemporaryEffect({
    id: EffectId.Yerba,
    title: `Yerba`,
    onAddBonuses:function(stats){
        stats.vitality += 5;
    }
});