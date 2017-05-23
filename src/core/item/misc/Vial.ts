import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import ItemUsable from '../ItemUsable';
import PlayerCharacter from '../../creature/player/PlayerCharacter';
import WishCalc from '../../../bot/commands/WishCalc';

export const Vial = new ItemUsable({
    id: ItemId.Vial,
    title: 'Vial',
    description: 'A small vial of glowing water which heals 50 points of health when drank. \n\nAfter a chance encounter a healer discovered a method of using wishes to create a viscous healing liquid. It was only a matter of time before savvy investors capitalized on the art.',
    goldValue: 10,
    buyCost: 20,
    battleExhaustion: 1,
    recipe:{
        components:[
            {
                itemId: ItemId.Acai,
                amount: 1,
            },
        ],
        wishes: 1,
    },
    canUse: function(user:PlayerCharacter){
        if(user.hpCurrent >= user.stats.hpTotal){
            throw `${user.title}'s HP is already full`;
        }
    },
    onUse: function(user:PlayerCharacter):string{
        const amountToHeal = Math.min( 50 , user.stats.hpTotal-user.hpCurrent );

        user.hpCurrent += amountToHeal;

        return `${user.title} healed ${amountToHeal}HP, now has ${user.hpCurrent}/${user.stats.hpTotal}HP`;
    }
});