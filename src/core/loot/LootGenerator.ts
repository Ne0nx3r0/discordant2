import ItemBase from '../item/ItemBase';
import { HandAxe,WoodShield,HuntingSword,WornLeathers,TabletOfHealing,TabletOfPoison,SonicLongsword,StoneAxe,StoneDagger,Vial,Sage,Yerba,Bane,Acai,Fox } from "../item/ItemsIndex";
import ItemId from '../item/ItemId';
import { Tent } from "../item/misc/Tent";

export interface IGenerateLootBag{
    startingNode:string;
    chanceToGenerate:number;
    chanceToGoUp?:number;
    maxStepsUp?:number;
    magicFind?:number;
}

export default class LootGenerator{
    lootNodes:Map<string,LootNode>;

    constructor(){
        this.lootNodes = new Map();
        this.lootNodes.set( 'root' , new LootNode('root',null) );

        this.addLootItem('common.weapons.physical',HandAxe,0.5);
        this.addLootItem('common.weapons.physical',WoodShield,0.5);
        this.addLootItem('common.weapons.physical',HuntingSword,0.4);
        this.addLootItem('common.equipment.armor',WornLeathers,0.4);
        this.addLootItem('common.consumables',Vial,0.8);
        this.addLootItem('common.herbs',Sage,0.5);
        this.addLootItem('common.herbs',Yerba,0.5);
        this.addLootItem('common.herbs',Bane,0.5);
        this.addLootItem('common.herbs',Fox,0.5);
        this.addLootItem('common.herbs',Acai,1);

        this.addLootItem('uncommon.weapons.tablets',TabletOfHealing,0.2);
        this.addLootItem('uncommon.weapons.tablets',TabletOfPoison,0.2);
        this.addLootItem('uncommon.weapons.physical',StoneDagger,0.15);
        this.addLootItem('uncommon.consumables',Tent,0.2);
        
        this.addLootItem('rare.weapons.thunder',SonicLongsword,0.05);
        this.addLootItem('rare.weapons.physical',StoneAxe,0.05);
    }

    addLootItem(node:string,item:ItemBase,rarity:number){
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

        const itemLootNode = new LootNode('root.'+node,parentNode,rarity,item);
        
        this.lootNodes.set('root.'+node+'.'+ItemId[item.id],itemLootNode);
        
        lootNode.addChild(itemLootNode);
    }

    generateLoot(bag:IGenerateLootBag):number{
        let lootNode = this.lootNodes.get(bag.startingNode);

        if(!lootNode){
            throw 'Invalid loot starting node root.'+bag.startingNode;
        }

        //Check if this call will even generate loot
        if(Math.random() > bag.chanceToGenerate){
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

    constructor(node:string,parent:LootNode,rarity?:number,item?:ItemBase){
        this.node = node;
        this.rarity = rarity;
        this.children = [];
        this.parent = parent;
        this.itemId = item ? item.id : null;
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
            const adjustedRarity = c.rarity + magicFind;

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