import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import ItemUsable from '../ItemUsable';
import PlayerCharacter from '../../creature/player/PlayerCharacter';
import BattleTemporaryEffectAttributeBoost from '../../effects/BattleTemporaryEffectAttributeBoost';
import EffectId from '../../effects/EffectId';
import { Attribute } from "../../creature/AttributeSet";
import { EffectSage } from '../../effects/types/EffectSage';

export const Sage = new ItemUsable({
    id: ItemId.Sage,
    title: 'Sage',
    description: '(During a battle: boosts SPR) Salvia officinalis, a minty wild flower known to raise mental acuteness and state of mind of those who consume it.',
    goldValue: 15,
    canUseInbattle: true,
    canUseInParty: false,
    battleExhaustion: 1,
    onUse: function(user:PlayerCharacter,target:PlayerCharacter):string{
        target.battle.addTemporaryEffect(target,EffectSage,30);

        return null;
    }
});