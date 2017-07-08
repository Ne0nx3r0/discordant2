import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses, { CharacterClassId } from '../../core/creature/player/CharacterClasses';

export default class Inventory extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'classes',
            description: 'List the available classes',
            usage: 'classes [className]',
            permissionNode: PermissionId.Classes,
            minParams: 0,
        });

        this.aliases.set('class','classes');
    }

    async run(bag:CommandRunBag){
        if(bag.params.length == 0){
            const classesArr = [];

            CharacterClasses.forEach(function(cl:CharacterClass){
                if(cl.id == 0) return;//Don't show Nobody class

                classesArr.push(cl.title);
            });

            bag.message.channel.send('Available classes: ' + classesArr.join(', '));

            return;
        }

        const className = bag.params[0];

        const characterClass:CharacterClass = CharacterClasses.find((val) => {
            return val.title.toUpperCase() === className.toUpperCase();
        });

        if(!characterClass){
            bag.message.channel.send(`${className} is not a valid class, ${bag.message.author.username}`);

            return;
        }

        const c = characterClass;   

        if(c.id == CharacterClassId.Nobody){
            return;
        }
        
        let equipStr = '';
        
        if(c.startingEquipment.amulet) equipStr += ', '+c.startingEquipment.amulet.title;
        if(c.startingEquipment.pouch) equipStr += ', '+c.startingEquipment.pouch.title;
        if(c.startingEquipment.ring) equipStr += ', '+c.startingEquipment.ring.title;
        if(c.startingEquipment.hat) equipStr += ', '+c.startingEquipment.hat.title;
        if(c.startingEquipment.armor) equipStr += ', '+c.startingEquipment.armor.title;
        if(c.startingEquipment.weapon) equipStr += ', '+c.startingEquipment.weapon.title;
        if(c.startingEquipment.offhand) equipStr += ', '+c.startingEquipment.offhand.title;

        equipStr = equipStr.substr(2);

        const msgEmbed = `**${c.title}**
${c.description}

Starting Attributes: 
Strength: ${c.startingAttributes.strength}   Agiilty: ${c.startingAttributes.agility}   Vitality: ${c.startingAttributes.vitality}   Spirit: ${c.startingAttributes.spirit}   Luck: ${c.startingAttributes.luck}

Starting equipment: 
${equipStr}`;

        bag.message.channel.send('',this.getEmbed(msgEmbed,0x63FF47));
    }
}