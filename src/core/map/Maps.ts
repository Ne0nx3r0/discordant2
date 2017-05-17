import ExplorableMap from './ExplorableMap';
import { WesternGate2Events } from "../../../assets/maps/WesternGate2/WesternGate2Events";
import { WesternGate2LootEvents } from "../../../assets/maps/WesternGate2Loot/WesternGate2LootEvents";

const WesternGate2Map = new ExplorableMap(
    'WesternGate2',
    'The Western Gate',
    require('../../../assets/maps/WesternGate2/WesternGate2Layout.json'),
    WesternGate2Events
);

const WesternGate2LootMap = new ExplorableMap(
    'WesternGate2Loot',
    'The Western Gate (Loot)',
    require('../../../assets/maps/WesternGate2Loot/WesternGate2LootLayout.json'),
    WesternGate2LootEvents
);

export {
    WesternGate2Map,
    WesternGate2LootMap,
};