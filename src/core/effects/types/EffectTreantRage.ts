import EffectId from "../EffectId";
import BattleTemporaryEffect from "../BattleTemporaryEffect";
import PlayerCharacter from "../../creature/player/PlayerCharacter";
import ItemId from "../../item/ItemId";
import { DamageType } from "../../item/WeaponAttackStep";

export const EffectTreantRage = new BattleTemporaryEffect({
    id: EffectId.TreantRage,
    title: 'Treant Rage',
    onAddBonuses: function(e){
        e.resistances.dark += 20;
        e.resistances.physical += 20;
        e.resistances.fire -= 10;
    },
    onAttack: (e)=>{
        e.wad.type = DamageType.fire;
        e.wad.amount = Math.round(e.wad.amount * 1.2);
    }
});