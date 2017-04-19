import PermissionId from './PermissionId';
import { 
    AdminPermissions as AdminPermissionsProduction,
    AnonymousPermissions as AnonymousPermissionsProduction, 
    BannedPermissions as BannedPermissionsProduction,
    PlayerPermissions as PlayerPermissionsProduction,
    TesterPermissions as TesterPermissionsProduction,
} from './PermissionRoles.Production';

import { 
    AdminPermissions as AdminPermissionsDevelopment,
    AnonymousPermissions as AnonymousPermissionsDevelopment, 
    BannedPermissions as BannedPermissionsDevelopment,
    PlayerPermissions as PlayerPermissionsDevelopment,
    TesterPermissions as TesterPermissionsDevelopment,
} from './PermissionRoles.Development';

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

    constructor(production:boolean){
        this._roles = new Map();

        if(production){
            this.anonymous = new PermissionRole('anonymous',AnonymousPermissionsProduction);
            this._roles.set('anonymous',this.anonymous);
            this._roles.set('banned',new PermissionRole('banned',BannedPermissionsProduction));
            this._roles.set('player',new PermissionRole('player',PlayerPermissionsProduction));
            this._roles.set('tester',new PermissionRole('tester',TesterPermissionsProduction));        
            this._roles.set('admin',new PermissionRole('admin',AdminPermissionsProduction));
        }
        else{
            this.anonymous = new PermissionRole('anonymous',AnonymousPermissionsDevelopment);
            this._roles.set('anonymous',this.anonymous);
            this._roles.set('banned',new PermissionRole('banned',BannedPermissionsDevelopment));
            this._roles.set('player',new PermissionRole('player',PlayerPermissionsDevelopment));
            this._roles.set('tester',new PermissionRole('tester',TesterPermissionsDevelopment));        
            this._roles.set('admin',new PermissionRole('admin',AdminPermissionsDevelopment));
        }
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



