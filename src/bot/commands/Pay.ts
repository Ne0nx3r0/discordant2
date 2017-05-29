import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import ParseNumber from '../../util/ParseNumber';

export default class Pay extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'pay',
            description: 'pay a player an amount of gold',
            usage: 'pay <\@username> [amount]',
            permissionNode: PermissionId.Pay,
            minParams: 2,
        });
    }

    async run(bag:CommandRunBag){
        const tagUserId = this.getUserTagId(bag.params[0]);

        if(!tagUserId){
            bag.message.channel.send(this.getUsage());

            return;
        }

        if(tagUserId == bag.message.author.id){
            throw `You want to pay it to yourself? :|`;
        }

        const payTo = await bag.socket.getPlayer(tagUserId);

        if(!payTo){
            throw `That player has not registered yet`;
        }

        const payAmount = ParseNumber(bag.params.slice(1).join(' '));

        if(isNaN(payAmount)){
            throw 'Invalid amount';
        }

        if(payAmount < 1){
            throw 'You cannot pay someone a negative amount';
        }

        const newItemAmount = await bag.socket.transferGold(
            bag.message.author.id,
            tagUserId,
            payAmount
        );
    
        bag.message.channel.send(`${bag.message.author.username} gave ${payTo.title} ${payAmount}GP`);
    }
}