import BattleTemporaryEffect from '../BattleTemporaryEffect';
import EffectId from '../EffectId';
import { Attribute } from '../../creature/AttributeSet';

export const EffectShieldGold = new BattleTemporaryEffect({
    id: EffectId.MagicShieldGold,
    title: 'Gold Shield',
    onAdded:function(effectBag){
        effectBag.sendBattleEmbed([`+${effectBag.target.title} gains +100 thunder resistance!`]);
    },
    onRemoved:function(effectBag){
        effectBag.sendBattleEmbed([`-${effectBag.target.title}'s thunder shield broke`]);
    },
    onAddBonuses:function(stats){
        stats.resistances.thunder += 100;
    }
});