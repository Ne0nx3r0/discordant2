import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import { WishType } from '../../gameserver/socket/requests/LevelUpRequest';

const WishTypes = ['STRENGTH', 'AGILITY', 'VITALITY', 'SPIRIT', 'LUCK'];

export default class SetRole extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'wish',
            description: 'Use wishes to take an action. Wishes convert to 2gp each, respec costs the current amount of wishes to level.',
            usage: 'wish <strength|agility|vitality|spirit|luck|gold>',
            permissionNode: PermissionId.Wish,
            minParams: 1,
        });
    }

    async run(bag:CommandRunBag){
        const wishType = bag.params[0].toUpperCase();
        
        if(wishType == 'GOLD' || wishType == 'GP'){
            const amount = parseInt(bag.params[1]);

            if(isNaN(amount)){
                bag.message.channel.send(`Invalid amount, ${bag.message.author.username}`);

                return;
            }

            if(amount < 1){
                bag.message.channel.send(`You stare up to the sky with hope in your eyes... But nothing happens, ${bag.message.author.username}`);

                return;
            }

            const response = await bag.socket.convertWishesToGold(bag.message.author.id,amount);

            bag.message.channel.send(`You use your wishes to become ${response.goldGained}GP richer, ${response.goldTotal}GP total`);

            return;
        }

        if(wishType == 'RESPEC'){ 
            const resultMsg = await bag.socket.respecPlayer(bag.message.author.id);

            bag.message.channel.send(resultMsg);

            return;
        }

        if(WishTypes.indexOf(wishType) == -1){
            bag.message.channel.send(this.getUsage());

            return;
        }

        const numLevels = parseInt(bag.params[1]) - 1;
        for (let i = 0; i < numLevels; i++) {
            await bag.socket.levelUp(bag.message.author.id,wishType as WishType);
        }

        const pc = await bag.socket.levelUp(bag.message.author.id,wishType as WishType);

        let msg;

        switch(wishType){
            case 'STRENGTH':
                msg = `You use your wishes to become stronger (${pc.stats.strength})`;
            break;
            
            case 'AGILITY':
                msg = `Your use your wishes to become faster (${pc.stats.agility})`;
            break;
            
            case 'VITALITY':
                msg = `You use your wishes to become hardier (${pc.stats.vitality})`;
            break;
            
            case 'SPIRIT':
                msg = `You use your wishes to attune with the world (${pc.stats.spirit})`;
            break;
            
            case 'LUCK':
                msg = `You use your wishes to become luckier (${pc.stats.luck})`;
            break;
        }

        bag.message.channel.send(`${msg}, ${bag.message.author.username}`);
    }
}