import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import { WishType } from '../../gameserver/socket/requests/LevelUpRequest';

const WishTypes = ['STRENGTH', 'AGILITY', 'VITALITY', 'SPIRIT', 'LUCK', 'CHARISMA'];

export default class SetRole extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'wish',
            description: 'Use wishes to take an action',
            usage: 'wish <strength|agility|vitality|spirit|luck|charisma>',
            permissionNode: PermissionId.Wish,
            minParams: 1,
        });
    }

    async run(bag:CommandRunBag){
        const wishType = bag.params[0].toUpperCase();
        
        if(WishTypes.indexOf(wishType) == -1){
            bag.message.channel.sendMessage(this.getUsage());

            return;
        }

        const pc = await bag.socket.levelUp(bag.message.author.id,wishType as WishType);

        let msg;

        switch(wishType){
            case 'STRENGTH':
                msg = `You use your wishes to become stronger (${pc.stats.Strength})`;
            break;
            
            case 'AGILITY':
                msg = `Your use your wishes to become faster (${pc.stats.Agility})`;
            break;
            
            case 'VITALITY':
                msg = `You use your wishes to become hardier (${pc.stats.Vitality})`;
            break;
            
            case 'SPIRIT':
                msg = `You use your wishes to attune with the world (${pc.stats.Spirit})`;
            break;
            
            case 'LUCK':
                msg = `You use your wishes to become luckier (${pc.stats.Luck})`;
            break;

            case 'CHARISMA':
                msg = `You use your wishes to become more charming (${pc.stats.Charisma})`;
            break;
        }

        bag.message.channel.sendMessage(`${msg}, ${bag.message.author.username}`);
    }
}