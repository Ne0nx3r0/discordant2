import BattleTemporaryEffect from '../BattleTemporaryEffect';
import EffectId from '../EffectId';
import { Attribute } from '../../creature/AttributeSet';

export const EffectShieldGold = new BattleTemporaryEffect({
    id: EffectId.MagicShieldGold,
    title: 'Gold Shield',
    onAdded:(e)=>{
        e.battle.queueBattleMessage([`+${e.target.title} gains +100 thunder resistance!`]);
    },
    onRemoved:(e)=>{
        e.battle.queueBattleMessage([`-${e.target.title}'s thunder shield broke`]);
    },
    onAddBonuses:function(stats){
        stats.resistances.thunder += 100;
    }
});