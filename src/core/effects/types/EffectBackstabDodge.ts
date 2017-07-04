import BattleTemporaryEffect from '../BattleTemporaryEffect';
import EffectId from '../EffectId';
import { Attribute } from '../../creature/AttributeSet';

export const EffectBackstabDodge = new BattleTemporaryEffect({
    id: EffectId.BackstabDodge,
    title: 'Dodge',
    onAddBonuses:function(stats){
        stats.dodgeAlways = true;
    }
});