import ExplorableMap from './ExplorableMap';

const TestMap = new ExplorableMap(
    'test',
    require('../../../assets/maps/test/map.json'),
    require('../../../assets/maps/test/mapData.json')
);

const WesternGateMap = new ExplorableMap(
    'WesternGate',
    require('../../../assets/maps/WesternGate/map.json'),
    require('../../../assets/maps/WesternGate/mapData.json')
);

export {
    TestMap,
    WesternGateMap
};