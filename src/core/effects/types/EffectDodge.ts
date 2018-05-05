import BattleTemporaryEffect from '../BattleTemporaryEffect';
import EffectId from '../EffectId';
import { Attribute } from '../../creature/AttributeSet';

interface AttributeBoostBag{
    id: EffectId;
    title: string;
    attribute: Attribute;
    amount: number;
}

export const EffectDodge = new BattleTemporaryEffect({
    id: EffectId.Dodge,
    title: 'Dodge',
    onAdded:(e)=>{
        e.battle.queueBattleMessage([`+${e.target.title} is blessed with +10 dodge!`]);
    },
    onRemoved:(e)=>{
        e.battle.queueBattleMessage([`-${e.target.title}'s blessing wore off`]);
    },
    onAddBonuses:function(stats){
        stats.dodge += 10;
    }
});