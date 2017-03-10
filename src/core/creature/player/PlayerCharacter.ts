import { PermissionRole } from '../../../bot/permissions/PermissionService';
import Creature from '../Creature';
import AttributeSet from '../AttributeSet';

type PlayerStatus = 'inCity' | 'invitedToPVPBattle' | 'inBattle' | 'invitedToParty' | 'inParty';

export {PlayerStatus};

interface BattleData{
    battle:PlayerBattle;
    defeated:boolean;
    attackExhaustion:number,
    queuedAttacks:Array<AttackStep>,
    blocking:boolean,
}

interface PartyData{
    inviteExpires?:number;
    party?:PlayerParty;
}

interface PCConfig{
    id:number,
    uid:string;
    discriminator:number;
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
    discriminator:number;
    battle:PlayerBattle;
    party:PlayerParty;
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
            id: o.id,
            title: o.title,
            description: o.description,
            attributes: o.attributes,
            equipment: o.equipment
        });

        this.uid = o.uid;
        this.discriminator = o.discriminator;
        this.class = o.class;
        this.xp = o.xp;
        this.wishes = o.wishes;
        this.inventory = o.inventory;
        this.role = o.role;
        this.karma = o.karma;

        this.status = 'inCity';
        this.party = null;
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
        return this.party && this.party.leader == this;
    }
}