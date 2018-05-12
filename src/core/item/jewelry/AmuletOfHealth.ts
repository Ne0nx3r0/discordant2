import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';

export const AmuletOfHealth = new ItemEquippable({
    id: ItemId.AmuletOfHealth,
    title: 'Amulet of Health',
    description: `(+2 Vitality) Wealthy elites will pay anything to prolong their lives as they come to an end. So it was no surprise after the birth of wishes that a variety of jewelry was comissioned to improve the health of the wearer.\n\nThis particular example is quite inferior and was likely discarded or sold to a buyer ignorant of its poor quality.`,
    goldValue: 1,
    slotType:'amulet',
    onAddBonuses:(e)=>{
        e.target.stats.vitality += 2;
    }
});