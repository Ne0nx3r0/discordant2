import EffectId from "../EffectId";
import BattleTemporaryEffect from "../BattleTemporaryEffect";
import PlayerCharacter from "../../creature/player/PlayerCharacter";
import ItemId from "../../item/ItemId";
import { DamageType } from "../../item/WeaponAttackStep";
import { EffectTreantRage } from "./EffectTreantRage";

export const EffectTreantRageTrigger = new BattleTemporaryEffect({
    id: EffectId.TreantRageTrigger,
    title: 'Treant Rage',
    onDefend: function(bag){
        const creature = bag.wad.target.creature;
        
        if(bag.wad.type === DamageType.fire && !creature.tempEffects.has(EffectTreantRage)){
            bag.battle.queueBattleMessage([
                `+ ${creature.title} flies into a rage from being set on fire!`
            ]);

            bag.battle.addTemporaryEffect(bag.wad.target.creature,EffectTreantRage,5);
        }

        return true;
    },
});