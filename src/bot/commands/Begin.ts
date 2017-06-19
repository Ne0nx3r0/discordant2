import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';

export default class Begin extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'begin',
            description: 'Start your adventure!',
            usage: 'begin [className]',
            permissionNode: PermissionId.Begin,
            minParams: 0,
        });
    }

    async run(bag:CommandRunBag){
        if(bag.role.title != 'anonymous'){
            bag.message.channel.send('You are already registered, '+bag.message.author.username);
            
            return;
        }

        if(bag.params.length<1){
            bag.message.channel.send('Usage: '+this.usage);

            return;
        }

        const author = bag.message.author;
        const className = bag.params[0];

        const characterClass:CharacterClass = CharacterClasses.find((val) => {
            return val.title.toUpperCase() === className.toUpperCase();
        });

        if(!characterClass){
            bag.message.channel.send(`${className} is not a valid class, ${author.username}`);

            return;
        }

        const player = await bag.socket.registerPlayer({
            uid: author.id,
            username: author.username,
            discriminator: author.discriminator,
            classId: characterClass.id,
        });

        bag.message.channel.send(`You were successfully registered, ${player.title}!`);

        // Grant them tester role
        bag.handlers.addChatRole(bag.message.author.id,'304064132343136256');
    }
}