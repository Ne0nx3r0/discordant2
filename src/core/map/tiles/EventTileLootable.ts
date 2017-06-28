import EventTile, { EventTileHandlerBag } from '../EventTile';
import ItemId from '../../item/ItemId';
import ItemBase from "../../item/ItemBase";
import PlayerCharacter from "../../creature/player/PlayerCharacter";
import { XPToLevel } from "../../../util/XPToLevel";
import { IGenerateLootBag } from "../../loot/LootGenerator";
import LootGenerator from '../../loot/LootGenerator';

interface EventTileLootableBag{
    lootSettings:IGenerateLootBag;
    onEnterMsg?:string;
    lootGenerator: LootGenerator;
    wishesMax: number;
    goldMax: number;
}

export default class EventTileLootable extends EventTile{
    lootSettings:IGenerateLootBag;
    onEnterMsg:string;
    lootGenerator: LootGenerator;
    wishesMax: number;
    goldMax: number;
    
    constructor(bag: EventTileLootableBag){
        super({
            stopsPlayer: false,
        });

        this.lootSettings = bag.lootSettings;
        this.onEnterMsg = bag.onEnterMsg;
        this.lootGenerator = bag.lootGenerator;
        this.wishesMax = bag.wishesMax;
        this.goldMax = bag.goldMax;
    }

    onEnter(bag:EventTileHandlerBag):boolean{
        const lootCollected:boolean = bag.metadata.getTileData(bag.coordinate,'lootCollected');

        if(lootCollected){
            return false;
        }
    
        if(this.onEnterMsg){
            bag.party.sendCurrentMapImageFile(this.onEnterMsg);
        }
        else{
            bag.party.sendCurrentMapImageFile('Some loot! (`di` to see what it is)');
        }

        return true;
    }

    onInteract(bag:EventTileHandlerBag):boolean{
        const lootCollected:boolean = bag.metadata.getTileData(bag.coordinate,'lootCollected');

        if(lootCollected){
            return false;
        }

        bag.metadata.setTileData(bag.coordinate,'lootCollected',true);

        let partyMagicFind = 0;

        bag.player.party.members.forEach(function(member){
            partyMagicFind += member.stats.magicFind;
        });

        let lootLines = [];

        bag.player.party.members.forEach((member)=>{
            let lootItemId:number = this.lootGenerator.generateLoot({
                startingNode: this.lootSettings.startingNode,
                chanceToGenerate: this.lootSettings.chanceToGenerate,
                chanceToGoUp: this.lootSettings.chanceToGoUp || 0,
                maxStepsUp: this.lootSettings.maxStepsUp || 0,
                magicFind: partyMagicFind,
            });

            //Either they got an item, or we give them wishes or gold
            if(lootItemId != null){
                const item = bag.party.game.items.get(lootItemId);

                lootLines.push(`${member.title} found ${item.title}`);
                
                bag.party.game.grantPlayerItem(member.uid,lootItemId,1);
            }
            else{
                if(Math.random() < 0.2){
                    const wishesAmount = Math.round(this.wishesMax/2 + Math.random() * this.wishesMax / 2);

                    lootLines.push(`${member.title} found ${wishesAmount} wishes`);                        

                    bag.party.game.grantPlayerWishes(member.uid,wishesAmount);
                }
                else{
                    const goldAmount = Math.round(this.goldMax/2 + Math.random() * this.goldMax / 2);

                    lootLines.push(`${member.title} found ${goldAmount} gold`);

                    bag.party.game.grantPlayerGold(member.uid,goldAmount);
                }
            }
        });

        const lootLinesStr = lootLines.join('\n');

        bag.party.sendChannelMessage(`The party searched the area...\n\n${lootLinesStr}`);

        return true;
    }
}