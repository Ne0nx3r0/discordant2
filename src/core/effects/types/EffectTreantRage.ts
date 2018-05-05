import EffectId from "../EffectId";
import BattleTemporaryEffect from "../BattleTemporaryEffect";
import PlayerCharacter from "../../creature/player/PlayerCharacter";
import ItemId from "../../item/ItemId";
import { DamageType } from "../../item/WeaponAttackStep";

export const EffectTreantRage = new BattleTemporaryEffect({
    id: EffectId.TreantRage,
    title: 'Treant Rage',
    onAddBonuses: function(stats){
        stats.resistances.dark += 20;
        stats.resistances.physical += 20;
        stats.resistances.fire -= 10;
    },
});