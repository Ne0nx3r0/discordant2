import ItemBase from '../item/ItemBase';
import AllItems from '../item/AllItems';
import { Vial } from '../item/misc/Vial';
interface IGenerateLootBag{
    startingNode:string;
    chanceToGenerate:number;
    chanceToGoUp:number;
    maxStepsUp:number;
    magicFind:number;
}

export default class LootGenerator{
    lootNodes:Map<string,LootNode>;

    constructor(){
        this.lootNodes = new Map();
        this.lootNodes.set( 'root' , new LootNode('root',null) );
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
            }

            parentNode.addChild(lootNode);

            parentNode = lootNode;
        }

        lootNode.addChild(new LootNode(node,parentNode,rarity,item));
    }

    generateLoot(bag:IGenerateLootBag):number{
        let lootNode = this.lootNodes.get(bag.startingNode);

        if(lootNode){
            throw 'Invalid loot starting node '+bag.startingNode;
        }

        //Check if this call will even generate loot
        if(Math.random() > bag.chanceToGenerate){
            return null;
        }

        //Check if we need to go up the tree
        if(Math.random() < bag.chanceToGoUp){
            let stepsUp = Math.floor(Math.random() * bag.maxStepsUp)+1;

            while(stepsUp > 0 && lootNode.hasParent()){
                lootNode = lootNode.parent;
                
                stepsUp--;
            }
        }

        //Work our way down until we find an item
        while(lootNode.hasChildren()){
           // lootNode = lootNode.getRandomChild(bag.magicFind);
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

    addChild(node:LootNode){
        this.children.push(node);

        this.children.sort(function(a,b){
            return a.rarity - b.rarity;
        });

        this.rarity = 0;

        for(let i=0;i<this.children.length;i++){
            this.rarity += this.children[i].rarity;
        }
    }
}



const test = new LootGenerator();

test.addLootItem('common.consumables.herbs',Vial,0.5);