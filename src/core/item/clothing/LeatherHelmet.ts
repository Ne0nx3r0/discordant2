import ItemEquippable from "../ItemEquippable";
import ItemId from "../ItemId";

export const StuddedHelmet = new ItemEquippable({
    id: ItemId.StuddedHelmet,
    title: "Studded Helmet",
    description: `(+8 Physical Resistance) Leather helmet made from flexible leather reinforced with metal scraps.`,
    goldValue: 350,
    slotType: "hat",
    useRequirements:{
        strength: 26,
    },
    onAddBonuses:(e)=>{
        e.target.stats.resistances.physical += 8;
    },
});