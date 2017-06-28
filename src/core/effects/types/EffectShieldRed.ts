import BattleTemporaryEffect from '../BattleTemporaryEffect';
import EffectId from '../EffectId';
import { Attribute } from '../../creature/AttributeSet';

export const EffectShieldRed = new BattleTemporaryEffect({
    id: EffectId.MagicShieldRed,
    title: 'Red Shield',
    onAdded:function(effectBag){
        effectBag.sendBattleEmbed([`+${effectBag.target.title} gains +100 fire resistance!`]);
    },
    onRemoved:function(effectBag){
        effectBag.sendBattleEmbed([`-${effectBag.target.title}'s fire shield broke`]);
    },
    onAddBonuses:function(stats){
        stats.resistances.fire += 100;
    }
});