import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';

export default class Inventory extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'classes',
            description: 'List the available classes',
            usage: 'classes [className]',
            permissionNode: PermissionId.Classes,
            minParams: 0,
        });

        this.aliases = ['class'];
    }

    async run(bag:CommandRunBag){
        let msgEmbed = 'Available classes:';

        CharacterClasses.forEach(function(c:CharacterClass,key){
            let equipStr = '';
            
            if(c.startingEquipment.amulet) equipStr += ', '+c.startingEquipment.amulet.title;
            if(c.startingEquipment.bracer) equipStr += ', '+c.startingEquipment.bracer.title;
            if(c.startingEquipment.ring) equipStr += ', '+c.startingEquipment.ring.title;
            if(c.startingEquipment.hat) equipStr += ', '+c.startingEquipment.hat.title;
            if(c.startingEquipment.armor) equipStr += ', '+c.startingEquipment.armor.title;
            if(c.startingEquipment.weapon) equipStr += ', '+c.startingEquipment.weapon.title;
            if(c.startingEquipment.offhand) equipStr += ', '+c.startingEquipment.offhand.title;

            equipStr = equipStr.substr(2);

            msgEmbed += `\n
**${c.title}**
${c.description}

Starting Attributes: 
Strength: ${c.startingAttributes.Strength}   Agiilty: ${c.startingAttributes.Agility}   Vitality: ${c.startingAttributes.Vitality}   Spirit: ${c.startingAttributes.Spirit}   Luck: ${c.startingAttributes.Luck}

Starting equipment: 
${equipStr}`;
        });

        bag.message.channel.sendMessage('',this.getEmbed(msgEmbed,0x63FF47));
    }
}