import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';

export const FireAntHelmet = new ItemEquippable({
    id: ItemId.FireAntHelmet,
    title: 'Fire Ant Helmet',
    description: `(+2 physical resistance, +5 fire resistance) Armor fashioned from the shells of giant fire ants.\n\nThe castle in the Red Fored had a name, but it is long since forgotten and the dark creatures that dwell within it now have ensure no living being takes up residence.`,
    goldValue: 50,
    slotType:'hat',
    useRequirements: {
        strength: 24
    },
    recipe: {
        wishes: 75,
        components:[
            {
                itemId: ItemId.FireAntCarapace,
                amount: 15,
            },
        ],
    },
    onAddBonuses:(e)=>{
        e.target.stats.resistances.physical += 2;
        e.target.stats.resistances.fire += 5;
    }
});