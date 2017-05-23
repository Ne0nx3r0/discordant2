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
                            redirectedFrom = `(Redirected from *${bag.commandPrefix}${commandStr}*)`;
                        }
                    });
                });
            }

            if(!command && commandStr.substr(0,bag.commandPrefix.length).toUpperCase() == bag.commandPrefix.toUpperCase()){
                let stubCommandStr = commandStr.substr(bag.commandPrefix.length).toUpperCase();

                command = bag.commands.get(stubCommandStr);

                if(!command){
                    bag.commands.forEach((c)=>{
                        c.aliases.forEach((expandsTo,alias)=>{
                            if(stubCommandStr == alias.toUpperCase()){
                                command = c;
                                redirectedFrom = `(Redirected from *${bag.commandPrefix}${stubCommandStr.toLowerCase()}*)`;
                            }
                        });
                    });
                }
            }
            
            if(!command){
                bag.message.channel.sendMessage('Unknown command: '+commandStr);
            
                return;
            }

            let aliasesStr = '';

            if(command.aliases.size > 0){
                aliasesStr += 'Aliases:';
                
                command.aliases.forEach(function(expandsTo,alias){
                    aliasesStr += `\n ${bag.commandPrefix}${alias} => ${bag.commandPrefix}${expandsTo}`;
                });
            }

            bag.message.channel.sendMessage('',this.getEmbed(`
**${bag.commandPrefix.toLowerCase()}${command.name}** ${redirectedFrom}

${command.description}

${command.getUsage()}

${aliasesStr}
            `));

            return; 
        }

        
        const embed = new RichEmbed();
        const p = bag.commandPrefix;
        
        embed.setTitle('Commands');
        embed.setDescription('`'+p+'help [command]` for more info');
        
        embed.addField(
`User`,
`${p}begin, ${p}classes,
${p}stats, ${p}wish,
${p}ping
`,
true
        );
        
        embed.addField(
`Battle`,
`${p}attack, ${p}offhand, 
${p}charge, ${p}use`,
true
        );
        
        embed.addField(
`Player Market`,
`${p}mnew, ${p}msearch, 
${p}mbuy, ${p}msell,
${p}mlist, ${p}mstop`,
true
        );

        embed.addField(
`Items`,
`${p}item, ${p}items, ${p}inv,
${p}shop, ${p}buy, ${p}sell,
${p}equip, ${p}unequip,
${p}use, ${p}give, ${p}pay`,
true
        );

        embed.addField(
`Party`,
`${p}party, ${p}pnew,
${p}pinvite, ${p}pyes, ${p}pno,
${p}pdisband, ${p}pleave, ${p}pmap,
${p}pexplore, ${p}pmove `, 
true
        );

        bag.message.channel.sendEmbed(embed);
    }
}