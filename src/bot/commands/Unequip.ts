import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import ItemEquippable from '../../core/item/ItemEquippable';
import Weapon from '../../core/item/Weapon';
import { ValidEquipmentSlots, EquipmentSlot } from '../../core/item/CreatureEquipment';

export default class Equip extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'unequip',
            description: 'Unequip an item',
            usage: 'unequip '+ValidEquipmentSlots.join('|'),
            permissionNode: PermissionId.Unequip,
            minParams: 1,
        });
    }

    async run(bag:CommandRunBag){
        //TODO: don't allow unequipping items while in battle

        const slot:EquipmentSlot = bag.params[0] as EquipmentSlot;

        if(ValidEquipmentSlots.indexOf(slot) == -1){
            bag.message.channel.send(`${slot} is not a valid equipment slot`);

            return;
        }

        const playerUID = bag.message.author.id;

        const itemUnequippedId = await bag.socket.unequipItem(playerUID,slot);

        const itemUnequipped = bag.items.get(itemUnequippedId);

        bag.message.channel.send(`Unequipped ${itemUnequipped.title}, ${bag.message.author.username}`);
    }
}