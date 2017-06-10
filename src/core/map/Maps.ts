import ExplorableMap from './ExplorableMap';
import { WesternGate2Events } from "../../../assets/maps/WesternGate2/WesternGate2Events";
import { RedForestEvents } from '../../../assets/maps/RedForest/RedForestEvents';
import ItemId from '../item/ItemId';
import { RedForestMapPiece } from '../item/maps/RedForestMapPiece';
import { RedForestMap } from '../item/maps/RedForestMap';
import { RedForestCastleEvents } from "../../../assets/maps/RedForestCastle/RedForestCastleEvents";

export const MapWesternGate = new ExplorableMap({
    fileName: 'WesternGate2',
    title: 'Western Gate',
    mapJson: require('../../../assets/maps/WesternGate2/WesternGate2Layout.json'),
    mapData: WesternGate2Events,
});

export const MapRedForest = new ExplorableMap({
    fileName: 'RedForest',
    title: 'Red Forest',
    mapJson: require('../../../assets/maps/RedForest/RedForestLayout.json'),
    mapData: RedForestEvents,
    pieceItem: RedForestMapPiece,
    mapItem: RedForestMap
});

export const MapRedForestCastle = new ExplorableMap({
    fileName: 'RedForestCastle',
    title: 'Red Forest Castle',
    mapJson: require('../../../assets/maps/RedForestCastle/RedForestCastleLayout.json'),
    mapData: RedForestCastleEvents,
});

export const WorldMaps = {
    'RED FOREST': MapRedForest,
    'RED FOREST CASTLE': MapRedForestCastle,
    'WESTERN GATE': MapWesternGate, 
};