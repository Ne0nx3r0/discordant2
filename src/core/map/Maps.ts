import ExplorableMap from './ExplorableMap';
import { WesternGate2Events } from "../../../assets/maps/WesternGate2/WesternGate2Events";
import { RedForestEvents } from '../../../assets/maps/RedForest/RedForestEvents';
import ItemId from '../item/ItemId';
import { RedForestMapPiece } from '../item/maps/RedForestMapPiece';
import { RedForestMap } from '../item/maps/RedForestMap';
import { RedForestCastleEvents } from "../../../assets/maps/RedForestCastle/RedForestCastleEvents";
import { LivingWoodsEvents } from '../../../assets/maps/LivingWoods/LivingWoodsEvents';
import { LivingWoodsMapPiece } from '../item/maps/LivingWoodsMapPiece';
import { LivingWoodsMap } from '../item/maps/LivingWoodsMap';
import { RedForestCastleMapPiece } from '../item/maps/RedForestCastleMapPiece';
import { RedForestCastleMap } from '../item/maps/RedForestCastleMap';
import { TutorialEvents } from '../../../assets/maps/Tutorial/TutorialEvents';
import { Tutorial2Events } from '../../../assets/maps/Tutorial2/Tutorial2Events';

export const Tutorial = new ExplorableMap({
    fileName: 'Tutorial',
    title: 'Tutorial',
    mapJson: require('../../../assets/maps/Tutorial/TutorialLayout.json'),
    mapData: TutorialEvents,
});

export const Tutorial2 = new ExplorableMap({
    fileName: 'Tutorial2',
    title: 'Tutorial2',
    mapJson: require('../../../assets/maps/Tutorial2/Tutorial2Layout.json'),
    mapData: Tutorial2Events,
});

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
    mapItem: RedForestMap,
});

export const MapRedForestCastle = new ExplorableMap({
    fileName: 'RedForestCastle',
    title: 'Red Forest Castle',
    mapJson: require('../../../assets/maps/RedForestCastle/RedForestCastleLayout.json'),
    mapData: RedForestCastleEvents,
    pieceItem: RedForestCastleMapPiece,
    mapItem: RedForestCastleMap,
});

export const MapLivingWoods = new ExplorableMap({
    fileName: "LivingWoods",
    title: "Living Woods",
    mapJson: require('../../../assets/maps/LivingWoods/LivingWoodsLayout.json'),
    mapData: LivingWoodsEvents,
    pieceItem: LivingWoodsMapPiece,
    mapItem: LivingWoodsMap,
});

export const WorldMaps = {
    'RED FOREST': MapRedForest,
    'RED FOREST CASTLE': MapRedForestCastle,
    'WESTERN GATE': MapWesternGate, 
    'LIVING WOODS': MapLivingWoods,
    'TUTORIAL': Tutorial,
    'TUTORIAL2': Tutorial2,
};