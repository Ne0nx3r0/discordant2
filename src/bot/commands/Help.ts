import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import { RichEmbed } from 'discord.js';

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

            let redirectedFrom = '';

            if(!command){
                bag.commands.forEach((c)=>{
                    c.aliases.forEach((expandsTo,alias)=>{
                        if(commandStr == alias){
                            command = c;
                            redirectedFrom = `(Redirected from *${commandStr}*)`;
                        }
                    });
                });
            }

            if(!command){
                bag.message.channel.sendMessage('Unknown command: '+commandStr);
            
                return;
            }

            let aliasesStr = '';

            if(command.aliases.size > 0){
                aliasesStr += 'Aliases:';
                
                command.aliases.forEach(function(expandsTo,alias){
                    aliasesStr += `\n ${alias} => ${expandsTo}`;
                });
            }

            bag.message.channel.sendMessage('',this.getEmbed(`
${bag.commandPrefix.toLowerCase()}**${command.name}** ${redirectedFrom}

${command.description}

${command.getUsage()}

${aliasesStr}
            `));

            return; 
        }

        
        const embed = new RichEmbed();

        embed.setTitle('Commands');
        embed.setDescription('`'+bag.commandPrefix+'help [command]` for more info');
        
        embed.addField(
`User`,
`begin
classes
stats
wish
`,
true
        );
        
        embed.addField(
`Battle`,
`attack
block
charge
offhand
use`,
true
        );
        
        embed.addField(
`Player Market`,
`mbuy
mnew
msearch
msell
mstop
mbuy
mshop`,
true
        );

        embed.addField(
`Items`,
`inv
item
give
equip
unequip
use
sell
buy`,
true
        );

        embed.addField(
`Party`,
`party
pnew
pinvite
paccept
pdeny
pdisband 
pleave
pexplore
pmove`,
true
        );

        bag.message.channel.sendEmbed(embed);
    }
}