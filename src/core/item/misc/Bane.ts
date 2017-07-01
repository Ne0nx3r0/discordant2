import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import ItemUsable from '../ItemUsable';
import PlayerCharacter from '../../creature/player/PlayerCharacter';
import BattleTemporaryEffectAttributeBoost from '../../effects/BattleTemporaryEffectAttributeBoost';
import EffectId from '../../effects/EffectId';
import { Attribute } from "../../creature/AttributeSet";

export const Bane = new ItemUsable({
    id: ItemId.Bane,
    title: 'Bane',
    description: '(During a battle: boosts STR) Wolf\'s Bane, a poisonous wild flower used by many a hunter to subdue prey.',
    goldValue: 10,
    canUseInbattle: true,
    canUseInParty: false,
    battleExhaustion: 1,
    onUse: function(user:PlayerCharacter,target:PlayerCharacter):string{
        target.battle.addTemporaryEffect(target,new BattleTemporaryEffectAttributeBoost({
            id: EffectId.WolfsBane,
            title: `Wolf's Bane`,
            attribute: Attribute.strength,
            amount: 10,
        }),30);

        return `${target.title}'s strength is boosted!`;
    }
});