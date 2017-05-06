import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import ItemUsable from '../ItemUsable';
import PlayerCharacter from '../../creature/player/PlayerCharacter';
import BattleTemporaryEffectAttributeBoost from '../../effects/BattleTemporaryEffectAttributeBoost';
import EffectId from '../../effects/EffectId';
import { Attribute } from "../../creature/AttributeSet";

export const Sage = new ItemUsable({
    id: ItemId.Sage,
    title: 'Sage',
    description: '(During a battle: boosts SPR) Salvia officinalis, a minty wild flower known to raise mental acuteness and state of mind of those who consume it.',
    goldValue: 15,
    battleExhaustion: 1,
    canUse: function(user:PlayerCharacter){
        if(user.battle == null){
            throw 'You are not currently in a battle';
        }
    },
    onUse: function(user:PlayerCharacter):string{
        user.battle.addTemporaryEffect(user,new BattleTemporaryEffectAttributeBoost({
            id: EffectId.Sage,
            title: `Sage`,
            attribute: Attribute.spirit,
            amount: 10,
        }),30);

        return null;
    }
});