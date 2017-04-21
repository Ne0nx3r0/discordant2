import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';

export default class Inventory extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'help',
            description: 'Learn about a command',
            usage: 'help [command]',
            permissionNode: PermissionId.Help,
            minParams: 0,
        });
    }

    async run(bag:CommandRunBag){
        if(bag.params.length > 0){
            const commandStr = bag.params[0];
            let command = bag.commands.get(commandStr.toUpperCase());

            if(!command){
                bag.commands.forEach((c)=>{
                    c.aliases.forEach((alias)=>{
                        console.log(commandStr,alias);
                        if(commandStr == alias){
                            command = c;
                        }
                    });
                });
            }

            if(!command){
                bag.message.channel.sendMessage('Unknown command: '+commandStr);
            
                return;
            }

            bag.message.channel.sendMessage('',this.getEmbed(`
${bag.commandPrefix.toLowerCase()}**${command.name}**

${command.description}

${command.getUsage()}
            `));

            return; 
        }

        const commandsArr = [];

        bag.commands.forEach(function(command,commandStr){
            //Only show commands the player has permission to use
            if(bag.role.has(command.permissionNode)){
                commandsArr.push(command.name);
            }
        });

        commandsArr.sort();

        bag.message.channel.sendMessage('',this.getEmbed('Here are the commands you have access to, '+bag.message.author.username+':\n\n'+commandsArr.join(', ')
        +'\n\n`'+bag.commandPrefix.toLocaleLowerCase()+'help [command]` for more info'));
    }
}