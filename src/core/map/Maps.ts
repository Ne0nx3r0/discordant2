import ExplorableMap from './ExplorableMap';
import { WesternGate2Events } from "../../../assets/maps/WesternGate2/WesternGate2Events";


const MapWesternGate = new ExplorableMap(
    'WesternGate2',
    'Western Gate',
    require('../../../assets/maps/WesternGate2/WesternGate2Layout.json'),
    WesternGate2Events
);

export {
    MapWesternGate,
};