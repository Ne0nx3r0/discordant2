import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';

export const FireAntSkin = new ItemEquippable({
    id: ItemId.FireAntSkin,
    title: 'Fire Ant Skin',
    description: `A creature item`,
    goldValue: 30,
    showInItems: false,
    slotType:'armor',
    onAddBonuses:(e)=>{
        e.target.stats.resistances.physical += 2;
        e.target.stats.resistances.fire += 10;
    }
});