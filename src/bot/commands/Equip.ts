import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import ItemEquippable from '../../core/item/ItemEquippable';
import Weapon from '../../core/item/Weapon';

export default class Equip extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'equip',
            description: 'Equip an item',
            usage: 'equip <itemName> [offhand]',
            permissionNode: PermissionId.Equip,
            minParams: 1,
        });
    }

    async run(bag:CommandRunBag){
        const offhand:boolean = bag.params[bag.params.length-1] == 'offhand';

        const itemName = offhand ? bag.params.slice(0,-1).join(' ') : bag.params.join(' ');

        const itemBaseToEquip = bag.items.findByName(itemName);

        if(!itemBaseToEquip){
            throw `${itemName} not found`;
        }

        if(!(itemBaseToEquip instanceof ItemEquippable)){
            throw `${itemName} is not an equippable item`;
        }

        const itemEquippableToEquip = itemBaseToEquip as ItemEquippable;
        
        if(offhand && !(itemBaseToEquip instanceof Weapon)){
            throw `You cannot equip ${itemBaseToEquip.title} as an offhand weapon, ${bag.message.author.username}`;
        }

        const itemUnequippedId:number = await bag.socket.equipItem(
            bag.message.author.id,
            itemBaseToEquip.id,
            offhand
        );

        const itemUnequipped = bag.items.get(itemUnequippedId);

        if(itemUnequipped){
            bag.message.channel.send(`Equipped ${itemBaseToEquip.title}, unequipped ${itemUnequipped.title}`);
        }
        else{
            bag.message.channel.send(`Equipped ${itemBaseToEquip.title} `);
        }
    }
}