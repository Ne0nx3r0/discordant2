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
    PermissionId.Items,
    PermissionId.PartyNew,
    PermissionId.PartyInvite,
    PermissionId.PartyJoin,
    PermissionId.PartyExplore,
    PermissionId.PartyMove,
    PermissionId.Battle,
    PermissionId.BattleAttack,
    PermissionId.BattleOffhand,
    PermissionId.BattleCharge,
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
    PermissionId.Buy,
    PermissionId.MarketSell,
    PermissionId.MarketStop,
    PermissionId.MarketSearch,
    PermissionId.MarketNew,
    PermissionId.MarketBuy,
    PermissionId.Shop,
    PermissionId.MarketList,
    PermissionId.Sell,
    PermissionId.Lead,
    PermissionId.Pass,
    PermissionId.PartyLeave,
    PermissionId.DPR,
    PermissionId.Ping,
    PermissionId.BattleRun,
    PermissionId.Refresh,
    PermissionId.Craft,
    PermissionId.Pay,
    PermissionId.DodgeCalc,
    PermissionId.Daily,
    PermissionId.Heal,
    PermissionId.SCalc,
    PermissionId.PartyKick,
].concat(AnonymousPermissions).sort();

export const TesterPermissions = [
].concat(PlayerPermissions).sort();

export const AdminPermissions = [
].concat(TesterPermissions).sort();