import WeaponAttack from './WeaponAttack';
import Creature from '../creature/Creature';
import ItemEquippable from './ItemEquippable';
import { ItemEquippableBag, UseRequirements, OnAddBonusesHandler } from './ItemEquippable';
import {EquipmentSlot} from './CreatureEquipment';
import Use from '../../bot/commands/Use';

interface ItemWeaponBag{
    id:number;
    title:string;
    description:string;
    goldValue: number;
    damageBlocked:number;
    chanceToCritical?: number;
    criticalMultiplier?: number;
    useRequirements:UseRequirements;
    attacks:Array<WeaponAttack>;    
    onAddBonuses?:OnAddBonusesHandler;
}

export default class Weapon extends ItemEquippable{
    attacks:Array<WeaponAttack>;
    damageBlocked:number;//0.0 to 0.45 describing the % of damage this weapon blocks when the player blocks
    chanceToCritical: number;
    criticalMultiplier: number;

    constructor(bag:ItemWeaponBag){
        super({
            id:bag.id,
            title:bag.title,
            description:bag.description,
            goldValue: bag.goldValue,
            useRequirements: bag.useRequirements,
            onAddBonuses: bag.onAddBonuses,
            slotType:'weapon'//also offhand, but for slot type they are all primary
        });

        this.damageBlocked = bag.damageBlocked;
        this.chanceToCritical = bag.chanceToCritical || 0.1;
        this.criticalMultiplier = bag.criticalMultiplier || 2;
        this.attacks = bag.attacks;
        this.attacks.forEach((attack)=>{
            attack.weapon = this;
        });
    }

    findAttack(attackName:string):WeaponAttack{
        attackName = attackName.toUpperCase();
        
        for(var i=0;i<this.attacks.length;i++){
            const attack = this.attacks[i];

            if(attack.title.toUpperCase() == attackName){
                return attack;
            }
        }

        return null;
    }
}