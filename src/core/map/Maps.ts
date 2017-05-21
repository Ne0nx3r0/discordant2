import ExplorableMap from './ExplorableMap';
import { WesternGate2Events } from "../../../assets/maps/WesternGate2/WesternGate2Events";
import { RedForestEvents } from '../../../assets/maps/RedForest/RedForest';
import ItemId from '../item/ItemId';
import { RedForestMapPiece } from '../item/misc/RedForestMapPiece';
import { RedForestMap } from '../item/misc/RedForestMap';

const MapWesternGate = new ExplorableMap({
    fileName: 'WesternGate2',
    title: 'Western Gate',
    mapJson: require('../../../assets/maps/WesternGate2/WesternGate2Layout.json'),
    mapData: WesternGate2Events,
    pieceItem: null,
    mapItem: null
});

const MapRedForest = new ExplorableMap({
    fileName: 'RedForest',
    title: 'Red Forest',
    mapJson: require('../../../assets/maps/RedForest/RedForestLayout.json'),
    mapData: RedForestEvents,
    pieceItem: RedForestMapPiece,
    mapItem: RedForestMap
});

const WorldMaps = {
    'Red Forest': MapRedForest,
    'Western Gate': MapWesternGate,
};

export {
    MapWesternGate,
    MapRedForest,
    WorldMaps
};