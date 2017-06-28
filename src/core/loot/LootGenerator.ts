import ItemBase from '../item/ItemBase';
import { HandAxe, WoodShield, HuntingSword, WornLeathers, TabletOfHealing, TabletOfPoison, SonicLongsword, StoneAxe, StoneDagger, Vial, Sage, Yerba, Bane, Acai, Fox, RingOfFortune } from "../item/ItemsIndex";
import ItemId from '../item/ItemId';
import { Tent } from "../item/misc/Tent";

export interface IGenerateLootBag{
    startingNode:string;
    chanceToGenerate?:number;
    chanceToGoUp?:number;
    maxStepsUp?:number;
    magicFind?:number;
}

export default class LootGenerator{
    lootNodes:Map<string,LootNode>;

    constructor(){
        this.lootNodes = new Map();
        this.lootNodes.set( 'root' , new LootNode('root',null) );
    }

    addLootItem(node:string,itemId:number,rarity:number){
        const nodeSegments = node.split('.');

        let lootNode:LootNode;
        let parentNode:LootNode = this.lootNodes.get('root');

        //Do the last node separately
        for(let i=0;i<nodeSegments.length;i++){
            const nodeStep = 'root.'+nodeSegments.slice(0,i+1).join('.');

            lootNode = this.lootNodes.get(nodeStep);

            if(!lootNode){
                lootNode = new LootNode(nodeStep,parentNode);

                this.lootNodes.set(nodeStep,lootNode);
                
                parentNode.addChild(lootNode);
            }

            parentNode = lootNode;
        }

        const itemLootNode = new LootNode('root.'+node,parentNode,rarity,itemId);
        
        this.lootNodes.set('root.'+node+'.'+ItemId[itemId],itemLootNode);
        
        lootNode.addChild(itemLootNode);
    }

    generateLoot(bag:IGenerateLootBag):number{
        let startingNode = bag.startingNode;

        if(!startingNode.startsWith('root')){
            startingNode = 'root.'+startingNode;
        }

        let lootNode = this.lootNodes.get(startingNode);

        if(!lootNode){
            throw 'Invalid loot starting node root.'+startingNode;
        }

        //Check if this call will even generate loot
        //default is yes always generate a loot item id
        if(bag.chanceToGenerate && Math.random() > bag.chanceToGenerate){
            return null;
        }

        //Check if we need to go up the tree
        if(bag.chanceToGoUp && Math.random() < bag.chanceToGoUp){
            let stepsUp = Math.floor(Math.random() * bag.maxStepsUp)+1;

            while(stepsUp > 0 && lootNode.hasParent()){
                lootNode = lootNode.parent;
                
                stepsUp--;
            }
        }

        //Work our way down until we find an item
        while(lootNode.hasChildren()){
            lootNode = lootNode.getRandomChild(bag.magicFind);
        }

        return lootNode.itemId;
    }
}

class LootNode{
    rarity:number;
    node:string;
    parent: LootNode;
    children: Array<LootNode>;
    itemId: number;

    constructor(node:string,parent:LootNode,rarity?:number,itemId?:number){
        this.node = node;
        this.rarity = rarity;
        this.children = [];
        this.parent = parent;
        this.itemId = itemId || null;
    }

    hasChildren():boolean{
        return this.children.length > 0;
    }

    hasParent():boolean{
        return this.parent?true:false;
    }

    getRandomChild(magicFind:number):LootNode{
        let rollMax = 0;

        const tempRarities = this.children.map(function(c){
            const adjustedRarity = c.rarity + magicFind / 100;

            rollMax += adjustedRarity;

            return adjustedRarity;
        });

        let roll = Math.random() * rollMax;

        for(let i=0;i<tempRarities.length;i++){
            const tempRarity = tempRarities[i];

            if(tempRarity > roll){
                return this.children[i];
            }

            roll -= tempRarity;
        }

        throw 'returned null, NOOOOOO!';
    }

    addChild(node:LootNode){
        this.children.push(node);

        this.children.sort(function(a,b){
            return a.rarity - b.rarity;
        });

        this.updateRarity();
    }

    updateRarity(){
        this.rarity = 0;

        for(let i=0;i<this.children.length;i++){
            this.rarity += this.children[i].rarity;
        }

        if(this.parent){
            this.parent.updateRarity();
        }
    }
}