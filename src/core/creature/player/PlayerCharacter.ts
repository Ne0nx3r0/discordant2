import { PermissionRole } from '../../permissions/PermissionService';
import Creature from '../Creature';
import AttributeSet from '../AttributeSet';
import WeaponAttackStep from '../../item/WeaponAttackStep';
import CharacterClass from './CharacterClass';
import CreatureEquipment from '../../item/CreatureEquipment';
import PlayerInventory from '../../item/PlayerInventory';
import { SocketPlayerInventory } from '../../item/PlayerInventory';
import { SocketCreatureEquipment } from '../../item/CreatureEquipment';
import { ICreatureStatSet, SocketCreature } from '../Creature';
import PlayerParty from '../../party/PlayerParty';
import CreatureBattleTurnBased from '../../battle/CreatureBattleTurnBased';
import { CreaturePet } from '../CreaturePet';

type PlayerStatus = 'inCity' | 'invitedToPVPBattle' | 'inBattle' | 'invitedToParty' | 'inParty';

export {PlayerStatus};

interface PartyData{
    inviteExpires?:number;
    //party?:PlayerParty;
}

interface PCConfig{
    uid:string;
    title:string;
    description:string;
    attributes:AttributeSet,
    class:CharacterClass,
    equipment: CreatureEquipment,
    inventory: PlayerInventory,
    gold:number;
    level:number;
    wishes:number;
    role:PermissionRole;
    karma:number;
    lastDaily:number;
    stalls:number;
    activePet?: CreaturePet;
    pets: CreaturePet[];
    metadata:any;
    joinedDateStr: string;
}

export default class PlayerCharacter extends Creature{
    uid:string;
    battle:CreatureBattleTurnBased;
    party:PlayerParty;
    status:PlayerStatus;
    class:CharacterClass;
    gold:number;
    level:number;
    wishes:number;
    inventory:PlayerInventory;
    role:PermissionRole;
    karma:number;
    lastDaily:number;
    stalls:number;
    activePet?: CreaturePet;
    pets: CreaturePet[];
    metadata:any;
    joinedDateStr: string;

    constructor(o:PCConfig){
        super({
            id: -1,
            title: o.title,
            description: o.description,
            attributes: o.attributes,
            equipment: o.equipment
        });

        this.uid = o.uid;
        this.class = o.class;
        this.gold = o.gold;
        this.level = o.level;
        this.wishes = o.wishes;
        this.inventory = o.inventory;
        this.role = o.role;
        this.karma = o.karma;

        this.status = 'inCity';
        this.party = null;
        this.battle = null;
        this.lastDaily = o.lastDaily;
        this.stalls = o.stalls;
        this.activePet = o.activePet;
        this.pets = o.pets;
        this.metadata = o.metadata;
        this.joinedDateStr = o.joinedDateStr;
    }

    get isPartyLeader():boolean{
        return this.party && this.party.leader == this;
    }

    toSocket():SocketPlayerCharacter{
        return {
            id: -1,
            uid: this.uid,
            title: this.title,
            description: this.description,
            class: this.class.id,
            gold: this.gold,
            level: this.level,
            karma: this.karma,
            wishes: this.wishes,
            stalls: this.stalls,
            role: this.role.title,
            status: this.status,
            //inventory: this.inventory.toSocket(),
            equipment: this.equipment.toSocket(),
            hpCurrent: this.hpCurrent,
            stats: this.stats,
            battleChannelId: this.battle?this.battle.channelId:null,
            partyChannelId: this.party?this.party.channelId:null,
            joinedDateStr: this.joinedDateStr,
            activePetName: !this.activePet ? "-" : this.activePet.getDisplayName(),  
        };
    }
}

export interface SocketPlayerCharacter extends SocketCreature{
    class: number;
    gold: number;
    level: number;
    karma: number;
    wishes: number;
    stalls: number;
    role: string;
    status: PlayerStatus;
    battleChannelId?: string;
    partyChannelId?: string;
    joinedDateStr: string;
    activePetName: string;
}