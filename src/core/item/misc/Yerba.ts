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
    description: '(During a battle: +50HP for 30 rounds) Eriodictyon crassifolium, a shrub beloved by butterflies and other small bugs. When chewed it embues the chewer with a sense of bravery and purpose.',
    goldValue: 20,
    battleExhaustion: 1,
    canUseInbattle: true,
    canUseInParty: false,
    onUse: function(user:PlayerCharacter,target:PlayerCharacter):string{
        target.battle.addTemporaryEffect(target,new BattleTemporaryEffect({
            id: EffectId.Yerba,
            title: `Yerba`,
            onAddBonuses:function(stats){
                stats.hpTotal += 50;
            }
        }),30);

        return `+50HP`;
    }
});