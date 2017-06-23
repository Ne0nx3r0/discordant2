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
import { DamageScaling } from "../../core/damage/DamageScaling";
import { DamageType } from "../../core/item/WeaponAttackStep";
import { ItemRecipe } from '../../core/item/ItemRecipe';
import AllItems from '../../core/item/AllItems';
import ItemEquippable from '../../core/item/ItemEquippable';
import ItemUsable from '../../core/item/ItemUsable';

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
            bag.message.channel.send(this.getUsage());

            return;
        }

        const itemName = bag.params.join(' ');

        const item = bag.items.findByName(itemName);

        if(!item){
            bag.message.channel.send(itemName+' not found, '+bag.message.author.username);

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
/*
            embed.addField(
                'Damage Blocked',
                weapon.damageBlocked*100+'%',
                true
            );*/

            let useRequirementsStr = Object.keys(weapon.useRequirements)
            .map(function(key){
                return weapon.useRequirements[key]+' '+key;
            })
            .join(', ');

            if(useRequirementsStr == ''){
                useRequirementsStr = 'None';
            }

            embed.addField(
                'Use Requirements',
                useRequirementsStr,
                true
            );

            embed.addField(
                'Sell Value',
                item.goldValue+'GP',
                true
            );

            if(item.buyCost){
                embed.addField(
                    'Buy Cost',
                    item.buyCost+'GP',
                    true
                );
            }

            if(item.recipe){
                embed.addField(
                    'Recipe',
                    getRecipeString(item.recipe,bag.items).split(' and ').join('\n'),
                    true
                );
            }

            const pc = await bag.socket.getPlayer(bag.message.author.id);

            const attacksStr = weapon.attacks
            .map(function(attack){
                const special = attack.specialDescription?'\nSpecial: '+attack.specialDescription:'';4

                const chargesRequired = attack.chargesRequired > 0 ? '\nRequires ' + attack.chargesRequired +' charges': '';

                const scalingStat = Attribute[attack.scalingAttribute];

                let yourDamageStr = '';

                if(pc){
                    const yourMinDamage = DamageScaling.ByAttribute(attack.minBaseDamage,pc.stats[scalingStat]);
                    const yourMaxDamage = DamageScaling.ByAttribute(attack.maxBaseDamage,pc.stats[scalingStat]);

                    if(attack.scalingLevel != ScalingLevel.No){
                        yourDamageStr = `\n(${yourMinDamage} - ${yourMaxDamage} with your stats)`;
                    }
                }

                const damageStr = attack.damageType == DamageType.healing ? 'healing' : 'damage';

                const msg = `${attack.minBaseDamage} - ${attack.maxBaseDamage} ${DamageType[attack.damageType]} ${damageStr}${yourDamageStr}${special}
${ScalingLevel[attack.scalingLevel]} scaling with ${Attribute[attack.scalingAttribute]}${chargesRequired}`;

                embed.addField('(Attack) '+attack.title,msg);
            })
            .join('\n');

           // embed.addField('Attacks',attacksStr);

            bag.message.channel.sendEmbed(embed);
        }
        else{
            const itemBuyCost = item.buyCost ? `\nBuyable for ${item.buyCost}GP` : '';

            const recipeStr = item.recipe ? getRecipeString(item.recipe,bag.items) :'';

            let equipSlot = '';
            let useInBattle = '';
            let useWhileExploring = '';
            let requirementsStr = '';

            if(item instanceof ItemEquippable){
                const requirementKeys = Object.keys(item.useRequirements);

                if(requirementKeys.length > 0){
                    requirementsStr = '\nRequires '+requirementKeys.map(function(key){
                        return item.useRequirements[key]+' '+key;
                    })
                    .join(', ');
                }

                equipSlot = '\nCan be equipped to '+item.slotType+' slot';
            }

            if(item instanceof ItemUsable){
                useInBattle = item.canUseInbattle ? '\nCan be used during battle' : '';
                useWhileExploring = item.canUseInParty ? '\nCan be used outside of battle' : '';
            }

            bag.message.channel.send('',this.getEmbed(`
${item.title}

${item.description}

Sellable for ${item.goldValue}GP${itemBuyCost}${equipSlot+requirementsStr+useInBattle+useWhileExploring}${recipeStr}`,EmbedColors.INFO));
        }


    }
}

function getRecipeString(recipe:ItemRecipe,items:AllItems):string{
    if(!recipe){
        return '';
    }

    let recipeStr = '\n\nRecipe: '+recipe.components.map(function(component){
        const item = items.get(component.itemId);

        if(item){
            return component.amount + ' ' + item.title;
        }
        
        return component.amount + ' Item ID '+component.itemId;
    }).join(', ');

    if(recipe.wishes){
        if(recipe.wishes == 1){
            recipeStr += ' and '+recipe.wishes+' wish';
        }
        else{
            recipeStr += ' and '+recipe.wishes+' wishes';
        }
    }

    return recipeStr;
}