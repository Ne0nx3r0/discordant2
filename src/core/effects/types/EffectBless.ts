import BattleTemporaryEffect from '../BattleTemporaryEffect';
import EffectId from '../EffectId';
import { Attribute } from '../../creature/AttributeSet';

interface AttributeBoostBag{
    id: EffectId;
    title: string;
    attribute: Attribute;
    amount: number;
}

export const EffectBless = new BattleTemporaryEffect({
    id: EffectId.Bless,
    title: 'Bless',
    onAdded:function(effectBag){
        effectBag.sendBattleEmbed([`+${effectBag.target.title} is blessed with 10% better resistances!`]);
    },
    onRemoved:function(effectBag){
        effectBag.sendBattleEmbed([`-${effectBag.target.title}'s blessing wore off`]);
    },
    onAddBonuses:function(stats){
        stats.resistances.physical += 0.1;
        stats.resistances.fire += 0.1;
        stats.resistances.thunder += 0.1;
        stats.resistances.chaos += 0.1;
        stats.resistances.acid += 0.1;
    }
});