import EventTile from '../EventTile';
import ItemId from '../../item/ItemId';
import ItemBase from "../../item/ItemBase";
import PlayerCharacter from "../../creature/player/PlayerCharacter";
import { XPToLevel } from "../../../util/XPToLevel";
import { IGenerateLootBag } from "../../loot/LootGenerator";

const DEBRIS_MESSAGES = [
    `Looks like a small skirmish took place here... Maybe something useful is left?`,
    `Someone left a burlap sack on the ground. Coud be a trap.`,
    `A large cracked chest left behind from a caravan or passing trader`,
];

interface EventTileLootableBag{
    onEnterMsg?:string;
    lootSettings?:IGenerateLootBag;
}

export function EventTileLootable(tileBag:EventTileLootableBag){
    return new EventTile({
        onEnter: function(bag){
            if(bag.runCount == 0){
                if(tileBag.onEnterMsg){
                    bag.sendPartyMessage(tileBag.onEnterMsg);
                }
                else{
                    bag.sendPartyMessage(DEBRIS_MESSAGES[Math.floor(DEBRIS_MESSAGES.length*Math.random())]);
                }
            }
        },
        onInteract: function(bag){
            if(bag.runCount == 0){
                let partyMagicFind = 0;

                bag.player.party.members.forEach(function(member){
                    partyMagicFind += member.stats.magicFind;
                });

                let lootLines = [];

                bag.player.party.members.forEach((member)=>{
                    const mf = member.stats.magicFind;

                    let lootItemId:number;

                    if(tileBag.lootSettings){
                        lootItemId = bag.party.game.lootGenerator.generateLoot({
                            startingNode: tileBag.lootSettings.startingNode,
                            chanceToGenerate: tileBag.lootSettings.chanceToGenerate,
                            chanceToGoUp: tileBag.lootSettings.chanceToGoUp || 0,
                            maxStepsUp: tileBag.lootSettings.maxStepsUp || 0,
                            magicFind: mf,
                        });
                    }
                    else{
                        lootItemId = bag.party.game.lootGenerator.generateLoot({
                            startingNode: 'root.common',
                            magicFind: partyMagicFind,
                            chanceToGenerate: 0.5,
                            chanceToGoUp: 0.025,
                            maxStepsUp: 1,
                        });
                    }

                    //no item generated, this player gets gold
                    if(lootItemId != null){
                        const item = bag.party.game.items.get(lootItemId);

                        lootLines.push(`${member.title} found ${item.title}`);
                        
                        bag.party.game.grantPlayerItem(member.uid,lootItemId,1);
                    }
                    else{
                        if(Math.random() < 0.2){
                            const wishesBase = XPToLevel[member.level]/100;

                            const wishesAmount = Math.round(wishesBase/2 + Math.random() * wishesBase / 2);

                            lootLines.push(`${member.title} found ${wishesAmount} wishes`);                        

                            bag.party.game.grantPlayerWishes(member.uid,wishesAmount);
                        }
                        else{
                            const goldBase = Math.round(XPToLevel[member.level]/10);

                            const goldAmount = Math.round(goldBase/2 + Math.random() * goldBase / 2);

                            lootLines.push(`${member.title} found ${goldAmount} gold`);

                            bag.party.game.grantPlayerGold(member.uid,goldAmount);
                        }
                    }
                });

                const lootLinesStr = lootLines.join('\n');

                bag.sendPartyMessage(`The party searched the area...\n\n${lootLinesStr}`);

                return true;
            }
            else{
                return false;
            }
        }
    });
}