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
            usage: 'wish <gold|strength|agility|vitality|spirit|luck|charisma>',
            permissionNode: PermissionId.Wish,
            minParams: 1,
        });
    }

    async run(bag:CommandRunBag){
        const wishType = bag.params[0].toUpperCase();
        
        if(wishType == 'GOLD' || wishType == 'GP'){
            const amount = parseInt(bag.params[1]);

            if(isNaN(amount)){
                bag.message.channel.sendMessage(`Invalid amount, ${bag.message.author.username}`);

                return;
            }

            if(amount < 1){
                bag.message.channel.sendMessage(`You stare up at the sky hopefully, but nothing happens, ${bag.message.author.id}`);
            }

            const response = await bag.socket.convertWishesToGold(bag.message.author.id,amount);

            bag.message.channel.sendMessage(`You use your wishes to become ${response.goldGained}GP richer, ${response.goldTotal}GP total`);

            return;
        }

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