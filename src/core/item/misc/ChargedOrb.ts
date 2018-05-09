import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';

export const ChargedOrb = new ItemEquippable({
    id: ItemId.ChargedOrb,
    title: 'Charged Orb',
    description: `Begin a battle with 2 extra charges`,
    goldValue: 500,
    useRequirements: {
        spirit: 32,
    },
    showInItems: true,
    slotType: 'pouch',
    onBattleBegin: (e)=>{
        e.target.charges += 2;
    },
});