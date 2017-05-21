import ExplorableMap from './ExplorableMap';
import { WesternGate2Events } from "../../../assets/maps/WesternGate2/WesternGate2Events";


const WesternGate2Map = new ExplorableMap(
    'WesternGate2',
    'The Western Gate',
    require('../../../assets/maps/WesternGate2/WesternGate2Layout.json'),
    WesternGate2Events
);

export {
    WesternGate2Map,
};