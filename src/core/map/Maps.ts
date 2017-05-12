import ExplorableMap from './ExplorableMap';
import { WesternGate2MapData } from "../../../assets/maps/WesternGate2/mapData";
/*
const TestMap = new ExplorableMap(
    'test',
    require('../../../assets/maps/test/map.json'),
    require('../../../assets/maps/test/mapData.json')
);
*/
const WesternGate2Map = new ExplorableMap(
    'WesternGate2',
    'The Western Gate',
    require('../../../assets/maps/WesternGate2/map.json'),
    WesternGate2MapData
);

export {
    WesternGate2Map
};