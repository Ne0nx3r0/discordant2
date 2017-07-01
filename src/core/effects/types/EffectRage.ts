import BattleTemporaryEffect from '../BattleTemporaryEffect';
import EffectId from '../EffectId';
import { Attribute } from '../../creature/AttributeSet';

export const EffectRage = new BattleTemporaryEffect({
    id: EffectId.Rage,
    title: 'Rage',
    onAddBonuses: function(stats){
        stats.vitality -= 4;
        stats.strength += 10;
    }
})