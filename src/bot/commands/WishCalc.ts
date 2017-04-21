import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import GetEarnedWishes from '../../util/GetEarnedWishes';

export default class WishCalc extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'wishcalc',
            description: 'Calculate how many wishes a given player would earn in a given party',
            usage: 'wishcalc <baseWishes> <playerLevel> <HighestPlayerLevelInParty> <partySize>',
            permissionNode: PermissionId.WishCalc,
            minParams: 4,
        });

        this.aliases.set('wc','wishcalc');
    }

    async run(bag:CommandRunBag){
        for(var i=0;i<4;i++){
            if(isNaN(parseInt(bag.params[i]))){
                bag.message.channel.sendMessage(this.getUsage());

                return;
            }
        }

        const earnedWishes = GetEarnedWishes({
            baseWishes: parseInt(bag.params[0]),
            playerLevel: parseInt(bag.params[1]),
            highestLevel: parseInt(bag.params[2]),
            partySize: parseInt(bag.params[3])
        });

        bag.message.channel.sendMessage(`${earnedWishes} wishes, ${bag.message.author.username}`);
    }
}