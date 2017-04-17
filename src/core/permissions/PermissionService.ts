import PermissionId from './PermissionId';
import { AdminPermissions, AnonymousPermissions, BannedPermissions, PlayerPermissions, TesterPermissions } from '../../../PermissionRoles';

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

        this.anonymous = new PermissionRole('anonymous',AnonymousPermissions);

        this._roles.set('anonymous',this.anonymous);
        this._roles.set('banned',new PermissionRole('banned',BannedPermissions));
        this._roles.set('player',new PermissionRole('player',PlayerPermissions));
        this._roles.set('tester',new PermissionRole('tester',TesterPermissions));        
        this._roles.set('admin',new PermissionRole('admin',AdminPermissions));
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



