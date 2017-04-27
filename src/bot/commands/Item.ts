import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import EmbedColors from '../../bot/util/EmbedColors';
import Weapon from '../../core/item/Weapon';
import {RichEmbed} from 'discord.js';
import { EMBED_COLORS } from '../util/ChatHelpers';
import { ScalingLevel } from "../../core/item/WeaponAttack";
import { Attribute } from "../../core/creature/AttributeSet";

export default class Item extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'item',
            description: 'Learn about an item',
            usage: 'item <itemName>',
            permissionNode: PermissionId.Item,
            minParams: 1,
        });
    }

    async run(bag:CommandRunBag){
        if(bag.params.length < 1){
            bag.message.channel.sendMessage(this.getUsage());

            return;
        }

        const itemName = bag.params.join(' ');

        const item = bag.items.findByName(itemName);

        if(!item){
            bag.message.channel.sendMessage(itemName+' not found, '+bag.message.author.username);

            return;
        }

        if(item instanceof Weapon){
            const weapon:Weapon = item;
            const embed = new RichEmbed();

            embed.setColor(EMBED_COLORS.INFO);
            embed.setTitle(item.title);
            embed.setDescription(item.description);

            embed.addField(
                'Critical Rate',
                (weapon.chanceToCritical*100)+'%',
                true
            );

            embed.addField(
                'Critical Multiplier',
                weapon.criticalMultiplier+'x damage',
                true
            );

            embed.addField(
                'Damage Blocked',
                weapon.damageBlocked*100+'%',
                true
            );

            const useRequirementsStr = Object.keys(weapon.useRequirements)
            .map(function(key){
                return weapon.useRequirements[key]+' '+key;
            })
            .join(', ');

            embed.addField(
                'Use Requirements',
                useRequirementsStr
            );

            const attacksStr = weapon.attacks
            .map(function(attack){
                const special = attack.specialDescription?'\nSpecial: '+attack.specialDescription:'';4

                const chargesRequired = attack.chargesRequired > 0 ? '\nRequires ' + attack.chargesRequired +' charges': '';

                const msg = `
${special}${attack.minBaseDamage} to ${attack.maxBaseDamage} ${attack.damageType} damage
${ScalingLevel[attack.scalingLevel]} scaling with ${Attribute[attack.scalingAttribute]}
Exhausts ${attack.exhaustion} points${chargesRequired}`;

                embed.addField('(Attack) '+attack.title,msg);
            })
            .join('\n');

           // embed.addField('Attacks',attacksStr);

            bag.message.channel.sendEmbed(embed);
        }
        else{
            bag.message.channel.sendMessage('',this.getEmbed(`
                ${item.title}

                ${item.description}
            `,EmbedColors.INFO));
        }


    }
}