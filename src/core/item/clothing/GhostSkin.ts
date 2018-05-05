import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';

export const GhostSkin = new ItemEquippable({
    id: ItemId.GhostSkin,
    title: 'Ghost Skin',
    description: `A creature item`,
    goldValue: 1,
    showInItems: false,
    slotType: 'armor',
    onAddBonuses: function(e){
        e.target.stats.resistances.physical += 100;
        e.target.stats.resistances.dark += 40;
        e.target.stats.resistances.fire -= 10;
    }
});