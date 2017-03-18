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
            minParams: 1,
        });
    }

    run(bag:CommandRunBag){
        if(bag.role.title != 'anonymous'){
            bag.message.channel.sendMessage('You are already registered, '+bag.message.author.username);
            
            return;
        }

        if(bag.params.length<1){
            bag.message.channel.sendMessage('Usage: '+this.usage);

            return;
        }

        const author = bag.message.author;
        const className = bag.params[0];

        const characterClass:CharacterClass = CharacterClasses.find((val) => {
            return val.title.toUpperCase() === className.toUpperCase();
        });

        if(!characterClass){
            bag.message.channel.sendMessage(`${className} is not a valid class, ${author.username}`);

            return;
        }

        (async()=>{
            try{
                const player = await bag.socket.registerPlayer({
                    uid: author.id,
                    username: author.username,
                    discriminator: author.discriminator,
                    classId: characterClass.id,
                });

                bag.message.channel.sendMessage(`You were successfully registered, ${player.title}!`);
            }
            catch(ex){
                bag.message.channel.sendMessage(`${ex}, ${bag.message.author.username}`);
            }
        })();
    }
}