import ExplorableMap from './ExplorableMap';
/*
const TestMap = new ExplorableMap(
    'test',
    require('../../../assets/maps/test/map.json'),
    require('../../../assets/maps/test/mapData.json')
);
*/
const WesternGate2Map = new ExplorableMap(
    'WesternGate2',
    require('../../../assets/maps/WesternGate2/map.json'),
    require('../../../assets/maps/WesternGate2/mapData')
);

export {
    WesternGate2Map
};