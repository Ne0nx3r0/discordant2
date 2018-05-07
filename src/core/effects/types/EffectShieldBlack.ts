import BattleTemporaryEffect from '../BattleTemporaryEffect';
import EffectId from '../EffectId';
import { Attribute } from '../../creature/AttributeSet';

export const EffectShieldBlack = new BattleTemporaryEffect({
    id: EffectId.EffectShieldBlack,
    title: 'Black Shield',
    onAdded:function(e){
        e.battle.queueBattleMessage([`+${e.target.title} gains +100 dark resistance!`]);
    },
    onRemoved:function(e){
        e.battle.queueBattleMessage([`-${e.target.title}'s dark shield broke`]);
    },
    onAddBonuses:function(stats){
        stats.resistances.dark += 100;
    }
});