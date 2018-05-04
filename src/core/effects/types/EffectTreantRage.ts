import BattleTemporaryEffect from '../BattleTemporaryEffect';
import EffectId from '../EffectId';
import { Attribute } from '../../creature/AttributeSet';

export const EffectTreantRage = new BattleTemporaryEffect({
    id: EffectId.TreantRage,
    title: 'TreantRage',
    onAddBonuses: function(stats){
        stats.resistances.dark += 20;
        stats.resistances.physical += 20;
        stats.resistances.fire -= 10;
    },
    onAttack: function(bag){
        bag

        return true;
    }
})