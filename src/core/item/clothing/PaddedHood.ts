import ItemEquippable from "../ItemEquippable";
import ItemId from "../ItemId";
import { EquipmentSlot } from "../CreatureEquipment";
import { ICreatureStatSet } from "../../creature/Creature";

export const PaddedHood = new ItemEquippable({
    id: ItemId.PaddedHood,
    title: "Padded Armor",
    description: `(+1 Physical Resistance, +2 Agility) Though it wouldn't stop a sword, these hoods often prove useful to keep one's head from being scratched or bumped.`,
    goldValue: 150,
    slotType:"hat",
    useRequirements:{
        strength: 8,
    },
    onAddBonuses:(e)=>{
        e.target.stats.resistances.physical += 1;
        e.target.stats.agility += 2;
    },
});