import ExplorableMap from './ExplorableMap';
import { WesternGate2Events } from "../../../assets/maps/WesternGate2/WesternGate2Events";
import { RedForestEvents } from '../../../assets/maps/RedForest/RedForest';

const MapWesternGate = new ExplorableMap(
    'WesternGate2',
    'Western Gate',
    require('../../../assets/maps/WesternGate2/WesternGate2Layout.json'),
    WesternGate2Events
);

const MapRedForest = new ExplorableMap(
    'RedForest',
    'Red Forest',
    require('../../../assets/maps/RedForest/RedForestLayout.json'),
    RedForestEvents
);

export {
    MapWesternGate,
    MapRedForest,
};