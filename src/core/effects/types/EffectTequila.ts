import BattleTemporaryEffect from '../BattleTemporaryEffect';
import EffectId from '../EffectId';
import { Attribute } from '../../creature/AttributeSet';
import BattleTemporaryEffectAttributeBoost from '../BattleTemporaryEffectStatsBoost';

export const EffectTequila = new BattleTemporaryEffect({
    id: EffectId.Tequila,
    title: `Tequila`,
    onAddBonuses: function(stats){
        stats.wishBonus += 5;
    }
})