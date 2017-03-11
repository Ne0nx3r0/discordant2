import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import ItemUsable from '../ItemUsable';
import PlayerCharacter from '../../creature/player/PlayerCharacter';

export default new ItemUsable({
    id: ItemId.HealingVial,
    title: 'Healing Vial',
    description: 'A small vial of glowing water which heals 25 points of health when drank.',
   /* hiddenDescription: 'After a chance encounter a healer discovered a method of using wish stones to create a viscous healing liquid. It was only a matter of time before savvy investors capitalized on the art.',
    hiddenDescriptionLoreNeeded: 20,*/
    battleExhaustion: 1,
    canUse: function(user:PlayerCharacter){
        if(user.HPCurrent >= user.stats.HPTotal){
            throw `${user.title}'s HP is already full`;
        }
    },
    onUse: function(user:PlayerCharacter):string{
        const amountToHeal = Math.min( 25 , user.stats.HPTotal-user.HPCurrent );

        user.HPCurrent += amountToHeal;

        return `${user.title} healed ${amountToHeal}HP, now has ${user.HPCurrent}/${user.stats.HPTotal}HP`;
    }
});