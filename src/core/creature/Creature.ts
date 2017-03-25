import AttributeSet from './AttributeSet';
import IDamageSet from '../damage/IDamageSet';
import CreatureEquipment from '../item/CreatureEquipment';
import ItemEquippable from '../item/ItemEquippable';
import { EquipmentSlot, SocketCreatureEquipment } from '../item/CreatureEquipment';
import BattleTemporaryEffect from '../battle/BattleTemporaryEffect';

export interface ICreatureStatSet{
    Strength: number,
    Agility: number,
    Vitality: number,
    Spirit: number,
    Charisma: number,
    Luck: number,
    HPTotal: number,
    Resistances: IDamageSet,
}

export interface CreatureBag{
    id:number;
    title:string;
    description:string;
    attributes: AttributeSet;
    equipment: CreatureEquipment;
}

export default class Creature{
    id: number;
    title: string;
    description: string;
    attributes: AttributeSet;
    equipment: CreatureEquipment;
    stats:ICreatureStatSet;
    HPCurrent: number;
    tempEffects:Map<BattleTemporaryEffect,number>;//rounds left

    constructor(bag:CreatureBag){
        this.id = bag.id;
        this.title = bag.title;
        this.description = bag.description;
        this.attributes = bag.attributes;
        this.equipment = bag.equipment;

        this.tempEffects = new Map();

        this.updateStats();
        
        this.HPCurrent = this.stats.HPTotal;
    }

    updateStats(){
        const stats:ICreatureStatSet = {
            Strength:this.attributes.Strength,
            Agility:this.attributes.Agility,
            Vitality:this.attributes.Vitality,
            Charisma:this.attributes.Charisma,
            Spirit:this.attributes.Spirit,
            Luck:this.attributes.Luck,
            Resistances:{
                Physical:0,
                Fire:0,
                Cold:0,
                Thunder:0,
                Chaos:0,
            },
            HPTotal: 0,
        };

        this.equipment.forEach(function(item:ItemEquippable,slot:EquipmentSlot){
            if(item.onAddBonuses){
               item.onAddBonuses(stats);
            }
        });

        this.tempEffects.forEach(function(roundsLeft:number,effect:BattleTemporaryEffect){
            if(effect.onAddBonuses){
                effect.onAddBonuses(stats);
            }
        });

        //These could be adjusted by bonuses
        stats.HPTotal += stats.Vitality * 10,

        stats.Resistances.Fire = Math.floor(stats.Agility/3)/100;
        stats.Resistances.Cold = Math.floor(stats.Strength/3)/100;
        stats.Resistances.Thunder = Math.floor(stats.Luck/3)/100;

        stats.Resistances.Chaos = Math.min(
            stats.Resistances.Physical,
            stats.Resistances.Fire,
            stats.Resistances.Cold,
            stats.Resistances.Thunder,
        );

        this.stats = stats;

        if(this.HPCurrent>this.stats.HPTotal) this.HPCurrent = this.stats.HPTotal;
    }

    addTemporaryEffect(effect:BattleTemporaryEffect,rounds:number){
        this.tempEffects.set(effect,rounds);

        if(effect.onAddBonuses){
            this.updateStats();
        }
    }

    removeTemporaryEffect(effect:BattleTemporaryEffect){
        this.tempEffects.delete(effect);

        if(effect.onAddBonuses){
            this.updateStats();
        }
    }

    clearTemporaryEffects(){
        this.tempEffects.clear();
        this.updateStats();
    }

    //Returns what percent (0.0-0.95) of damage to block when blocking
    get damagePercentBlocked():number{
        return Math.min(0.95,this.equipment.weapon.damageBlocked + this.equipment.offhand.damageBlocked);
    }

    toSocket(){

    }
}

export interface SocketCreature{
    uid: string;
    equipment: SocketCreatureEquipment;
    stats: ICreatureStatSet;
    title: string;
    description: string;
    HPCurrent: number;
}