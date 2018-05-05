import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';

export const FireAntArmor = new ItemEquippable({
    id: ItemId.FireAntArmor,
    title: 'Fire Ant Armor',
    description: `(+6 Physical Resistance, +10 fire resistance) Armor fashioned from the shells of giant fire ants.\n\nThe Red Forest was once a vibrant village with a lake children would play on and lovers would hold picnics, now consumed by the wish-imbued ants that in the past merely invaded picnics and nipped ankles.`,
    goldValue: 120,
    useRequirements: {
        strength: 24
    },
    slotType:'armor',
    recipe: {
        wishes: 125,
        components:[
            {
                itemId: ItemId.FireAntCarapace,
                amount: 40,
            },
        ],
    },
    onAddBonuses:(e)=>{
        e.target.stats.resistances.physical += 6;
        e.target.stats.resistances.fire += 10;
    }
});