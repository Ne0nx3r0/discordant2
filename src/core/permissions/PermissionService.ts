import PermissionId from './PermissionId';
//Hard coded permissions assigned to each role
const bannedPermissions = [

];

const anonymousPermissions = [
    PermissionId.Begin,
    PermissionId.Classes,
];

const playerPermissions = [
    PermissionId.Reset,
    PermissionId.Stats,
    PermissionId.Party,
    PermissionId.PartyNew,
    PermissionId.PartyInvite,
    PermissionId.PartyJoin,
    PermissionId.PartyExplore,
    PermissionId.PartyMove,
    PermissionId.Battle,
    PermissionId.BattleAttack,
    PermissionId.BattleOffhand,
    PermissionId.BattleBlock,
    PermissionId.Inventory,
    PermissionId.Help,
    PermissionId.Give,
    PermissionId.Equip,
    PermissionId.Unequip,
    PermissionId.Use,
    PermissionId.Challenge,
    PermissionId.Item,
    PermissionId.Echo,
    PermissionId.Embed,
    PermissionId.Grant,
    PermissionId.ChannelId,
    PermissionId.Shutdown,
    PermissionId.SetPlayingGame,
    PermissionId.SetRole,
].concat(anonymousPermissions).sort();

const testerPermissions = [
].concat(playerPermissions).sort();

const adminPermissions = [
].concat(testerPermissions).sort();

export class PermissionRole{
    title:string;
    permissions:Array<PermissionId>;

    constructor(title:string,permissions:Array<PermissionId>){
        this.title = title;
        this.permissions = permissions;
    }

    has(permission:PermissionId){
        return this.permissions.indexOf(permission) != -1;
    }
}

export default class PermissionsService{
    _roles:Map<string,PermissionRole>;
    anonymous:PermissionRole;

    constructor(){
        this._roles = new Map();

        this.anonymous = new PermissionRole('anonymous',anonymousPermissions);

        this._roles.set('anonymous',this.anonymous);
        this._roles.set('banned',new PermissionRole('banned',bannedPermissions));
        this._roles.set('player',new PermissionRole('player',playerPermissions));
        this._roles.set('tester',new PermissionRole('tester',testerPermissions));        
        this._roles.set('admin',new PermissionRole('admin',adminPermissions));
    }

    isRole(name:string){
        return this._roles.has(name);
    }

    getRoleNames(){
        const roles = [];

        this._roles.forEach(function(role,name){
            roles.push(name);
        });

        return roles;
    }

    getRole(name:string):PermissionRole{
        const role = this._roles.get(name);

        if(!role) return this.anonymous;

        return role;
    }
}



