import { IMapData } from "../../../src/core/map/IMapData";
import EventTileEnterMessage from "../../../src/core/map/tiles/EventTileEnterMessage";
import EventTileLootable from "../../../src/core/map/tiles/EventTileLootable";
import LootGenerator from "../../../src/core/loot/LootGenerator";
import * as ItemsIndex from '../../../src/core/item/ItemsIndex';
import { EventTileSpecificItem } from "../../../src/core/map/tiles/EventTileSpecificItem";
import { EventTile, EventTileHandlerBag } from "../../../src/core/map/EventTile";
import EventTileWarp from "../../../src/core/map/tiles/EventTileWarp";

class EventTileTutorialBegin extends EventTile{
    welcomeMessage:string = 'Welcome to the tutorial!\n\nThe PARTY marker shows where you are!\n\nTry typing `dpmove left`';

    constructor(){
        super({
            stopsPlayer: false,
        });
    }
    
    onEnter(e:EventTileHandlerBag):boolean{
        e.party.sendCurrentMapImageFile(this.welcomeMessage);

        const gotXP = e.metadata.getMapData("welcomeXP");

        if(!gotXP && e.player.wishes < 5){
            e.metadata.setMapData("welcomeXP",true);
        
            e.party.game.grantPlayerWishes(e.player.uid,5);
        }

        return true;
    }
}

export const TutorialEvents:IMapData = {
    startX: 3,
    startY: 13,
    encounterChance: 0,
    encounters:[
        
    ],
    eventTiles: [
        {
            coords: [
                {
                    x: 3,
                    y: 13,
                },
            ],
            event: new EventTileTutorialBegin(),
        },
        {
            coords: [
                {
                    x: 2,
                    y: 13,
                },
            ],
            event: new EventTileEnterMessage({
                stopsPlayer: true,
                message: 'Now try `dpmove up 3`',
            }),
        },
        {
            coords: [
                {
                    x: 2,
                    y: 10,
                },
            ],
            event: new EventTileEnterMessage({
                stopsPlayer: true,
                message: 'Nice job! What about `dpmove right 200`?',
            }),
        },
        {
            coords: [
                {
                    x: 8,
                    y: 10,
                },
            ],
            event: new EventTileEnterMessage({
                stopsPlayer: true,
                message: 'Ran into a wall? No worries! Why not explore a bit?\n\nTip: You can use `dpm u` (or d / l / r) instead of typing up / down / left / right`',
            }),
        },
        {
            coords:[
                {
                    x: 7,
                    y: 7,
                },
            ],
            event: new EventTileSpecificItem({
                enterMessage: 'Hey you found some loot!\n\n`dinteract` (or just `di`) to grab it!',
                interactMessage: 'You found a mace!\n\nTry `dequip mace` to use it!\n\n`dpmap` if you want to see the map again!',
                item: ItemsIndex.Mace,
            }),
        },
        {
            coords:[
                {
                    x: 2,
                    y: 6,
                },
            ],
            event: new EventTileSpecificItem({
                enterMessage: 'You found a hidden item! \n\nSometimes these are scattered about. \n\n`dinteract` or `di` to grab it!',
                interactMessage: 'You found a cloth tunic! You can use `ditem cloth tunic` to read about it or `dequip cloth tunic` to put it on!',
                item: ItemsIndex.ClothTunic,
            }),
        },
        {
            coords:[
                {
                    x: 5,
                    y: 4,
                },
                {
                    x: 6,
                    y: 4,
                },
            ],
            event: new EventTileSpecificItem({
                enterMessage: 'You can collect plants like this one with `dinteract` or just `di`',
                interactMessage: 'You got an acai berry! You can use it in battle or run `dcraft vial` to turn it into a health vial!',
                item: ItemsIndex.Acai,
            }),
        },
        {
            event: new EventTileWarp({
                warpOnEnter: true,
                mapTitle: 'Tutorial2',
                toCoordinate: {
                    x: 8,
                    y: 10,
                },
                message: 'Onward to the next map!',
            }),
            coords: [
                {
                    x: 4,
                    y: 2,
                },
                {
                    x: 5,
                    y: 2,
                },
            ],
        },  
    ],
};