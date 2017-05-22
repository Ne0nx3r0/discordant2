import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import ItemUsable from '../ItemUsable';
import PlayerCharacter from '../../creature/player/PlayerCharacter';
import BattleTemporaryEffectAttributeBoost from '../../effects/BattleTemporaryEffectAttributeBoost';
import EffectId from '../../effects/EffectId';
import { Attribute } from "../../creature/AttributeSet";
import BattleTemporaryEffect from '../../effects/BattleTemporaryEffect';

export const Agave = new ItemUsable({
    id: ItemId.Agave,
    title: 'Agave',
    description: '(During a battle: +5 physical resistance for 30 rounds) Agave Azuricana, once called "honey water" for its delicious nectar and capacity for being brewed into spirits.',
    goldValue: 25,
    battleExhaustion: 1,
    canUse: function(user:PlayerCharacter){
        if(user.battle == null){
            throw 'You are not currently in a battle';
        }
    },
    onUse: function(user:PlayerCharacter):string{
        user.battle.addTemporaryEffect(user,new BattleTemporaryEffect({
            id: EffectId.Agave,
            title: `Agave`,
            onAddBonuses:function(stats){
                stats.resistances.physical += 5;
            }
        }),30);

        return null;
    }
});