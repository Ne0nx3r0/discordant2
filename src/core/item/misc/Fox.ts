import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import ItemUsable from '../ItemUsable';
import PlayerCharacter from '../../creature/player/PlayerCharacter';
import BattleTemporaryEffectAttributeBoost from '../../effects/BattleTemporaryEffectAttributeBoost';
import EffectId from '../../effects/EffectId';
import { Attribute } from "../../creature/AttributeSet";

export default new ItemUsable({
    id: ItemId.Fox,
    title: 'Fox',
    description: '(During a battle: boosts AGL) Digitalis Lanata or "Foxglove", a wildflower that while toxic in large doses in the right amount can speed the heart and give the consumer just the edge they need in battle.',
    goldValue: 15,
    battleExhaustion: 1,
    canUse: function(user:PlayerCharacter){
        if(user.battle == null){
            throw 'You are not currently in a battle';
        }
    },
    onUse: function(user:PlayerCharacter):string{
        user.battle.addTemporaryEffect(user,new BattleTemporaryEffectAttributeBoost({
            id: EffectId.Fox,
            title: `Fox`,
            attribute: Attribute.agility,
            amount: 10,
        }),30);

        return null;
    }
});