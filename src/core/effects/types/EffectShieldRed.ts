import BattleTemporaryEffect from '../BattleTemporaryEffect';
import EffectId from '../EffectId';
import { Attribute } from '../../creature/AttributeSet';

export const EffectShieldRed = new BattleTemporaryEffect({
    id: EffectId.MagicShieldRed,
    title: 'Red Shield',
    onAdded:function(e){
        e.battle.queueBattleMessage([`+${e.target.title} gains +100 fire resistance!`]);
    },
    onRemoved:function(e){
        e.battle.queueBattleMessage([`-${e.target.title}'s fire shield broke`]);
    },
    onAddBonuses:function(stats){
        stats.resistances.fire += 100;
    }
});