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
import PlayerBattle from '../../battle/PlayerBattle';

type PlayerStatus = 'inCity' | 'invitedToPVPBattle' | 'inBattle' | 'invitedToParty' | 'inParty';

export {PlayerStatus};

interface BattleData{
    battle:PlayerBattle;
    defeated:boolean;
    attackExhaustion:number,
    queuedAttacks:Array<WeaponAttackStep>,
    blocking:boolean,
}

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
    xp:number;
    wishes:number;
    role:PermissionRole;
    karma:number;
}

export default class PlayerCharacter extends Creature{
    uid:string;
    battle:PlayerBattle;
    //party:PlayerParty;
    status:PlayerStatus;
    class:CharacterClass;
    xp:number;
    wishes:number;
    inventory:PlayerInventory;
    role:PermissionRole;
    karma:number;
    lastCommand:number;

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
        this.xp = o.xp;
        this.wishes = o.wishes;
        this.inventory = o.inventory;
        this.role = o.role;
        this.karma = o.karma;

        this.status = 'inCity';
        //this.party = null;
        this.battle = null;
        this.lastCommand = 0;
    }

    calculateDeathWishesLost():number{
        return this.wishes / 2;
    }

    calculateDeathXPLost():number{
        return this.xp * 0.01;
    }

    get isPartyLeader():boolean{
        return false;//this.party && this.party.leader == this;
    }

    toSocket():SocketPlayerCharacter{
        return {
            id: null,
            uid: this.uid,
            title: this.title,
            description: this.description,
            class: this.class.id,
            xp: this.xp,
            karma: this.karma,
            wishes: this.wishes,
            role: this.role.title,
            status: this.status,
            //inventory: this.inventory.toSocket(),
            equipment: this.equipment.toSocket(),
            HPCurrent: this.HPCurrent,
            stats: this.stats,
            battleChannelId: this.battle?this.battle.channelId:null,
        };
    }
}

export interface SocketPlayerCharacter extends SocketCreature{
    class: number;
    xp: number;
    karma: number;
    wishes: number;
    role: string;
    status: PlayerStatus;
    battleChannelId: string;
}