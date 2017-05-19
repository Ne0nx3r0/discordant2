import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import ItemUsable from '../ItemUsable';
import PlayerCharacter from '../../creature/player/PlayerCharacter';
import BattleTemporaryEffectAttributeBoost from '../../effects/BattleTemporaryEffectAttributeBoost';
import EffectId from '../../effects/EffectId';
import { Attribute } from "../../creature/AttributeSet";
import BattleTemporaryEffect from '../../effects/BattleTemporaryEffect';

export const Yerba = new ItemUsable({
    id: ItemId.Yerba,
    title: 'Yerba',
    description: '(During a battle: boosts VIT) Eriodictyon crassifolium, a shrub beloved by butterflies and other small bugs. When chewed it embues the chewer with a sense of bravery and purpose.',
    goldValue: 20,
    battleExhaustion: 1,
    canUse: function(user:PlayerCharacter){
        if(user.battle == null){
            throw 'You are not currently in a battle';
        }
    },
    onUse: function(user:PlayerCharacter):string{
        user.battle.addTemporaryEffect(user,new BattleTemporaryEffect({
            id: EffectId.Yerba,
            title: `Yerba`,
            onAddBonuses:function(stats){
                stats.hpTotal += 50;
            }
        }),30);

        return null;
    }
});