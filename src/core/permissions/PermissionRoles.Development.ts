import PermissionId from './PermissionId';

//Hard coded permissions assigned to each role
export const BannedPermissions = [

];

export const AnonymousPermissions = [
    PermissionId.Begin,
    PermissionId.Classes,
];

//indev players get all permissions
export const PlayerPermissions = Object
.keys(PermissionId)
.filter(function(key){
    return typeof PermissionId[key] === 'number';
})
.map(function(key){
    return PermissionId[key];
}).concat(AnonymousPermissions).sort();

export const TesterPermissions = [
].concat(PlayerPermissions).sort();

export const AdminPermissions = [
].concat(TesterPermissions).sort();