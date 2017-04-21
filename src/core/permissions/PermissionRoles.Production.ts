import PermissionId from './PermissionId';
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
    PermissionId.Wish,
    PermissionId.MarketSell,
    PermissionId.MarketStop,
    PermissionId.MarketSearch,
    PermissionId.MarketNew,
    PermissionId.MarketBuy,
].concat(AnonymousPermissions).sort();

export const TesterPermissions = [
    PermissionId.Echo,
    PermissionId.Embed,
    PermissionId.ChannelId,
].concat(PlayerPermissions).sort();

export const AdminPermissions = [
    PermissionId.Reset,
    PermissionId.Shutdown,
    PermissionId.Grant,
    PermissionId.SetRole,
    PermissionId.SetPlayingGame,
    PermissionId.Lockdown,
].concat(TesterPermissions).sort();