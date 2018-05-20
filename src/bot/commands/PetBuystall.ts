import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import { BotConstants } from '../BotConstants';
import { getStableUpgradeCost } from '../../core/pets/StableStallCosts';

export default class PetBuystall extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'petbuystall',
            description: 'Purchase a new pet stall for your stable',
            usage: 'pet buystall [yes]',
            permissionNode: PermissionId.PetBuyStall,
            minParams: 0,
        });

        this.aliases.set('pet buystall','petbuystall');
    }

    async run(bag:CommandRunBag){
        if(bag.params.length == 0){
            const player = await bag.socket.getPlayer(bag.message.author.id);
            const currentStalls = getStableUpgradeCost(player.stalls);

            if(currentStalls < 10){
                bag.message.channel.send(`You have ${player.stalls} stalls, it will cost ${currentStalls} wishes to create another stall\n\n\`${bag.commandPrefix}pet buystall yes\` to create another stall`);
            }
            else{
                bag.message.channel.send(`You have ${player.stalls} stalls, you cannot create anymore.`);
            }

            return;
        }

        if(bag.params[0] === "yes"){
            const newStallCount:number = await bag.socket.buyStableStall(bag.message.author.id);

            bag.message.channel.send(`You purchased a new stall! You now have ${newStallCount} stalls!`);
        }
    }
}