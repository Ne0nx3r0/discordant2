import AttributeSet from './AttributeSet';
import CreatureEquipment from '../item/CreatureEquipment';
import ItemEquippable from '../item/ItemEquippable';
import { EquipmentSlot, SocketCreatureEquipment } from '../item/CreatureEquipment';
import BattleTemporaryEffect from '../effects/BattleTemporaryEffect';
import { GetLuckXPBonus } from '../../util/GetLuckXPBonus';

interface IResistances{
    physical:number;
    fire:number;
    thunder:number;
    dark: number;
    chaos:number;
}

export interface ICreatureStatSet{
    strength: number;
    agility: number;
    vitality: number;
    spirit: number;
    luck: number;
    hpTotal: number;
    resistances: IResistances;
    magicFind: number;
    redEye: number;
    wishBonus: number;
    dodge: number;
    wishProtect: number;
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
    hpCurrent: number;
    tempEffects:Map<BattleTemporaryEffect,number>;//rounds left

    constructor(bag:CreatureBag){
        this.id = bag.id;
        this.title = bag.title;
        this.description = bag.description;
        this.attributes = bag.attributes;
        this.equipment = bag.equipment;

        this.tempEffects = new Map();

        this.updateStats();
        
        this.hpCurrent = this.stats.hpTotal;
    }

    updateStats(){
        const stats:ICreatureStatSet = {
            redEye: 1,
            strength: this.attributes.strength,
            agility: this.attributes.agility,
            vitality: this.attributes.vitality,
            spirit: this.attributes.spirit,
            luck: this.attributes.luck,
            resistances: {
                physical:0,
                fire:0,
                thunder:0,
                dark:0,
                chaos:0,
            },
            hpTotal: 0,
            magicFind: Math.floor(this.attributes.luck / 4),
            wishBonus: 0,
            wishProtect: 0,
            dodge: 0,
        };

        this.equipment.forEach(function(item:ItemEquippable,slot:EquipmentSlot){
            if(item.onAddBonuses){
               item.onAddBonuses(stats);
            }
        });

        this.tempEffects.forEach(function(roundsLeft:number,effect:BattleTemporaryEffect){
            if(effect.onAddBonuses){
                effect.onAddBonuses(stats,roundsLeft);
            }
        });

        //If an effect increased HP directly then they get that added to current HP immediately
        //vitality increases on the other hand don't get this benefit to prevent re-requip exploits
        this.hpCurrent += stats.hpTotal;

        //These could be adjusted by bonuses
        stats.hpTotal += stats.vitality * 10;

        stats.resistances.fire += Math.floor(stats.agility/5);
        stats.resistances.thunder += Math.floor(stats.luck/5);
        stats.resistances.dark += Math.floor(stats.vitality/10);

        //1% per 10 luck points
        stats.wishBonus += GetLuckXPBonus(stats.luck);

        stats.resistances.chaos = Math.min(
            stats.resistances.physical,
            stats.resistances.fire,
            stats.resistances.thunder,
            stats.resistances.dark,
        );

        this.stats = stats;

        if(this.hpCurrent>this.stats.hpTotal) this.hpCurrent = this.stats.hpTotal;
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

    toSocket():SocketCreature{
        return {
            uid: null,
            id: this.id,
            equipment: this.equipment.toSocket(),
            stats: this.stats,
            title: this.title,
            description: this.description,
            hpCurrent: this.hpCurrent
        };
    }
}

export interface SocketCreature{
    uid: string;
    id: number;
    equipment: SocketCreatureEquipment;
    stats: ICreatureStatSet;
    title: string;
    description: string;
    hpCurrent: number;
}