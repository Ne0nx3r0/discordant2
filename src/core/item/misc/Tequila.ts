import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import ItemUsable from '../ItemUsable';
import PlayerCharacter from '../../creature/player/PlayerCharacter';
import BattleTemporaryEffectAttributeBoost from '../../effects/BattleTemporaryEffectAttributeBoost';
import EffectId from '../../effects/EffectId';
import { Attribute } from "../../creature/AttributeSet";
import BattleTemporaryEffect from '../../effects/BattleTemporaryEffect';
import { EffectTequila } from '../../effects/types/EffectTequila';

export const Tequila = new ItemUsable({
    id: ItemId.Tequila,
    title: 'Tequila',
    description: '(+5% wishes) The result of burying an agave plant and leaving it for several days to ferment, this spirit has kept many a traveler warm on cold nights and led to a number of deeds which imbibers wish they could forget but are never allowed to.',
    goldValue: 80,
    canUseInbattle: true,
    canUseInParty: false,
    showInItems: true,
    battleExhaustion: 1,
    recipe: {
        wishes: 20,
        components: [
            {
                itemId: ItemId.Agave,
                amount: 2,
            }
        ],
    },
    onUse: function(user:PlayerCharacter,target:PlayerCharacter):string{
        target.battle.addTemporaryEffect(target,EffectTequila,30);

        return null;
    }
});