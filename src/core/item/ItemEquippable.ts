import ItemBase from './ItemBase';
import {ItemBaseBag} from './ItemBase';
import Creature from '../creature/Creature';
import {ICreatureStatSet} from '../creature/Creature';
import { EquipmentSlot } from './CreatureEquipment';
import CreatureBattleTurnBased, { IBattleCreature } from '../battle/CreatureBattleTurnBased';
import { IWeaponAttackDamages } from './WeaponAttackStep';


export interface UseRequirements{
    strength?:number;
    agility?:number;
    vitality?:number;
    spirit?:number;
    luck?:number;
}

interface BattleBeginEvent{
    battle: CreatureBattleTurnBased;
    target: Creature;
}

interface AddBonusesEvent{
    target: Creature;
}

export interface ItemEquippableBag extends ItemBaseBag{
    slotType:EquipmentSlot;
    useRequirements?:UseRequirements;
    lostOnDeath?:boolean;
    onAddBonuses?:(creature:Creature)=>void;
    onBattleBegin?:(e:BattleBeginEvent)=>void;
}

export default class ItemEquippable extends ItemBase implements ItemEquippableBag{
    slotType:EquipmentSlot;
    useRequirements:UseRequirements;
    lostOnDeath:boolean;
    onAddBonuses?:(creature:Creature)=>void;
    onBattleBegin?:(e:BattleBeginEvent)=>void;

    constructor(bag:ItemEquippableBag){
        super(bag);

        this.slotType = bag.slotType;

        if(bag.onAddBonuses) this.onAddBonuses = bag.onAddBonuses;
        if(bag.onBattleBegin) this.onBattleBegin = bag.onBattleBegin;

        this.useRequirements = bag.useRequirements || {};
        this.lostOnDeath = bag.lostOnDeath;
    }

    canEquip(creature:Creature){
        for(var useRequirement in this.useRequirements){
            const requirementAmount = this.useRequirements[useRequirement];

            if(creature.stats[useRequirement] < requirementAmount){
                return false;
            }
        }

        return true;
    }
}