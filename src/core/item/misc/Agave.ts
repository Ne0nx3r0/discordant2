import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import ItemUsable from '../ItemUsable';
import PlayerCharacter from '../../creature/player/PlayerCharacter';
import BattleTemporaryEffectAttributeBoost from '../../effects/BattleTemporaryEffectAttributeBoost';
import EffectId from '../../effects/EffectId';
import { Attribute } from "../../creature/AttributeSet";
import BattleTemporaryEffect from '../../effects/BattleTemporaryEffect';
import { EffectAgave } from '../../effects/types/EffectAgave';

export const Agave = new ItemUsable({
    id: ItemId.Agave,
    title: 'Agave',
    description: '(During a battle: +5 physical & fire resistance for 30 rounds) Agave Azuricana, once called "honey water" for its delicious nectar and capacity for being brewed into spirits.',
    goldValue: 25,
    canUseInbattle: true,
    canUseInParty: false,
    battleExhaustion: 1,
    onUse: function(user:PlayerCharacter,target:PlayerCharacter):string{
        target.battle.addTemporaryEffect(target,EffectAgave,30);

        return null;
    }
});