import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import ItemUsable from '../ItemUsable';
import PlayerCharacter from '../../creature/player/PlayerCharacter';
import BattleTemporaryEffectAttributeBoost from '../../effects/BattleTemporaryEffectAttributeBoost';
import EffectId from '../../effects/EffectId';
import { Attribute } from "../../creature/AttributeSet";
import { EffectFox } from '../../effects/types/EffectFox';

export const Fox = new ItemUsable({
    id: ItemId.Fox,
    title: 'Fox',
    description: '(During a battle: boosts AGL) Digitalis Lanata or "Foxglove", a wildflower that while toxic in large doses in the right amount can speed the heart and give the consumer just the edge they need in battle.',
    goldValue: 15,
    canUseInbattle: true,
    canUseInParty: false,
    battleExhaustion: 1,
    onUse: function(user:PlayerCharacter,target:PlayerCharacter):string{
        target.battle.addTemporaryEffect(target,EffectFox,30);

        return null;
    }
});