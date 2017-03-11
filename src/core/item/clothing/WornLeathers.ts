import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';
import { EquipmentSlot } from '../CreatureEquipment';
import { ICreatureStatSet } from '../../creature/Creature';

class WornLeathers extends ItemEquippable{
    constructor(){
        super({
            id: ItemId.WornLeathers,
            title: 'Worn Leathers',
            description: 'A set of hardened animal hide braces that cover the chest, arms and legs (+20% Physical Resistance)',
            slotType:'armor',
            onAddBonuses:function(stats:ICreatureStatSet){
                stats.Resistances.Physical += 0.2;
            }
        });
    }
}

export default new WornLeathers();