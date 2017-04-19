import PermissionId from './src/core/permissions/PermissionId';

//Hard coded permissions assigned to each role
export const BannedPermissions = [

];

export const AnonymousPermissions = [
    PermissionId.Begin,
    PermissionId.Classes,
];

export const PlayerPermissions = [
    PermissionId.Stats,
    PermissionId.WishCalc,
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
    PermissionId.ChannelId,
    PermissionId.Reset,
    PermissionId.Shutdown,
    PermissionId.Grant,
    PermissionId.SetRole,
    PermissionId.SetPlayingGame,
    PermissionId.Lockdown,
    PermissionId.MarketSell,
    PermissionId.MarketStop,
].concat(AnonymousPermissions).sort();

export const TesterPermissions = [
].concat(PlayerPermissions).sort();

export const AdminPermissions = [
].concat(TesterPermissions).sort();