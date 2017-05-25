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
                amount: 2,
            },
        ],
        wishes: 1,
    },
    canUseInbattle: true,
    canUseInParty: true,
    canUse: function(user:PlayerCharacter,target:PlayerCharacter){
        if(target.hpCurrent >= target.stats.hpTotal){
            throw `${target.title}'s HP is already full`;
        }
    },
    onUse: function(user:PlayerCharacter,target:PlayerCharacter):string{
        const amountToHeal = Math.min( 50 , target.stats.hpTotal-target.hpCurrent );

        target.hpCurrent += amountToHeal;

        return `${target.title} healed ${amountToHeal}HP, now has ${target.hpCurrent}/${target.stats.hpTotal}HP`;
    }
});