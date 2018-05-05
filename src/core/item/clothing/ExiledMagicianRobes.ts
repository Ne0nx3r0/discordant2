import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';

export const ExiledMagicianRobes = new ItemEquippable({
    id: ItemId.ExiledMagicianRobes,
    title: 'Exiled Magician Robes',
    description: `A creature item`,
    goldValue: 1,
    slotType:'armor',
    onAddBonuses:(e)=>{
        e.target.stats.resistances.physical += 20;
        e.target.stats.resistances.thunder += 20;
        e.target.stats.resistances.dark += 40;
        e.target.stats.resistances.fire += 20;
    }
});