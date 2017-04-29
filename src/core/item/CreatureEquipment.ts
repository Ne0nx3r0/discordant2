import ItemEquippable from './ItemEquippable';
import Weapon from './Weapon';

export type EquipmentSlot = 
    'amulet' |
    'armor' |
    'pouch' |
    'hat' |
    'offhand' |
    'ring' |
    'weapon'
;

const ValidEquipmentSlots = [
    'amulet',
    'armor',
    'pouch',
    'hat',
    'offhand',
    'ring',
    'weapon'
];

export {ValidEquipmentSlots};

export interface EquipmentBag{
    amulet?: ItemEquippable;//element resistance, item find, critical hits
    armor?: ItemEquippable;//physical resistance
    pouch?: ItemEquippable;//element resistance, item find, critical hits
    hat?: ItemEquippable;// ?
    offhand?: Weapon;
    ring?: ItemEquippable;//element resistance, item find, critical hits
    weapon?: Weapon;
}

interface ForEachItemFunc{
    (item:ItemEquippable,slot:EquipmentSlot): void
}

export default class CreatureEquipment{
    _items:EquipmentBag;

    constructor(equipmentBag:EquipmentBag){
        this._items = equipmentBag;
    }

    forEach(callback:ForEachItemFunc){
        Object.keys(this._items).forEach((slot:EquipmentSlot)=>{
            callback(this._items[slot] as ItemEquippable,slot);
        });
    }

    toDatabase():EquipmentBag{
        const toDb = {};

        Object.keys(this._items).forEach((slot:EquipmentSlot)=>{
            toDb[slot] = {
                id: (this._items[slot] as ItemEquippable).id
            };
        });

        return toDb;
    }

    get hat():ItemEquippable{
        return this._items.hat;
    }

    get armor():ItemEquippable{
        return this._items.armor;
    }

    get ring():ItemEquippable{
        return this._items.ring;
    }

    get amulet():ItemEquippable{
        return this._items.amulet;
    }

    get pouch():ItemEquippable{
        return this._items.pouch;
    }

    get weapon():Weapon{
        return this._items.weapon;
    }

    get offhand():Weapon{
        return this._items.offhand;
    }

    toSocket(){
        const socketEquipment:SocketCreatureEquipment = {};

        Object.keys(this._items).forEach((slot)=>{
            socketEquipment[slot] = (this._items[slot] as ItemEquippable).id
        });

        return socketEquipment;
    }

    get size(){
        return Object.keys(this._items).length;
    }
}

export interface SocketCreatureEquipment{
    amulet?: number;
    armor?: number;
    pouch?: number;
    hat?: number;
    offhand?: number;
    ring?: number;
    weapon?: number;
}