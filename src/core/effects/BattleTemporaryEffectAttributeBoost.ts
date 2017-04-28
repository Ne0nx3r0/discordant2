import BattleTemporaryEffect from './BattleTemporaryEffect';
import EffectId from './EffectId';
import { EMBED_COLORS } from '../../bot/util/ChatHelpers';
import { Attribute } from '../creature/AttributeSet';

interface AttributeBoostBag{
    id: EffectId;
    title: string;
    attribute: Attribute;
    amount: number;
}

export default class BattleTemporaryEffectAttributeBoost extends BattleTemporaryEffect{
    constructor(bag:AttributeBoostBag){
        super({
            id: bag.id,
            title: bag.title,
            onAdded:function(effectBag){
                effectBag.sendBattleEmbed(`${effectBag.target.title}'s ${bag.attribute} is boosted by ${bag.title}!`,EMBED_COLORS.BOOST);
            },
            onAddBonuses:function(stats){
                stats[bag.attribute] += bag.amount;
            }
        });
    }
}