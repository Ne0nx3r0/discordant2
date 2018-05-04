import BattleTemporaryEffect from '../BattleTemporaryEffect';
import EffectId from '../EffectId';
import { Attribute } from '../../creature/AttributeSet';

export const EffectShieldGrey = new BattleTemporaryEffect({
    id: EffectId.MagicShieldGrey,
    title: 'Grey Shield',
    onAdded:function(effectBag){
        effectbag.battle.queueBattleMessage([`+${effectBag.target.title} gains +100 physical resistance!`]);
    },
    onRemoved:function(effectBag){
        effectbag.battle.queueBattleMessage([`-${effectBag.target.title}'s physical shield broke`]);
    },
    onAddBonuses:function(stats){
        stats.resistances.physical += 100;
    }
});