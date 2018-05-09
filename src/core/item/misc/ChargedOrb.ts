import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';

export const ChargedOrb = new ItemEquippable({
    id: ItemId.ChargedOrb,
    title: 'Charged Orb',
    description: `(Start all battles with 2 charges) Sick of being caught off guard, these devices were developed by more adventurous magicians who needed to deploy legends at a moment's notice.`,
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