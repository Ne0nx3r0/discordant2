import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import ItemUsable from '../ItemUsable';
import PlayerCharacter from '../../creature/player/PlayerCharacter';
import BattleTemporaryEffectAttributeBoost from '../../effects/BattleTemporaryEffectAttributeBoost';
import EffectId from '../../effects/EffectId';
import { Attribute } from "../../creature/AttributeSet";
import BattleTemporaryEffect from '../../effects/BattleTemporaryEffect';

export const Tequila = new ItemUsable({
    id: ItemId.Tequila,
    title: 'Tequila',
    description: 'The result of burying an agave plant and leaving it for several days to ferment, this spirit has kept many a traveler warm on cold nights and led to a number of deeds which are never spoken of in polite company.',
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
        target.battle.addTemporaryEffect(target,new BattleTemporaryEffect({
            id: EffectId.Tequila,
            title: `Tequila`,
            onAddBonuses:function(stats){
                
            }
        }),30);

        return null;
    }
});