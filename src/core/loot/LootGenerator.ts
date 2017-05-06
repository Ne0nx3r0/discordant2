import ItemBase from '../item/ItemBase';
import AllItems from '../item/AllItems';
import { HandAxe,WoodShield,HuntingSword,WornLeathers,TabletOfHealing,TabletOfPoison,SonicLongsword,StoneAxe,StoneDagger,Vial,Sage,Yerba,Bane,Acai,Fox } from "../item/ItemsIndex";
import ItemId from '../item/ItemId';

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
            const nodeStep = nodeSegments.slice(0,i+1).join('.');

            lootNode = this.lootNodes.get(nodeStep);

            if(!lootNode){
                lootNode = new LootNode('root.'+nodeStep,parentNode);

                this.lootNodes.set('root.'+nodeStep,lootNode);
            }

            parentNode.addChild(lootNode);

            parentNode = lootNode;
        }

        lootNode.addChild(new LootNode('root.'+node,parentNode,rarity,item));
    }

    generateLoot(bag:IGenerateLootBag):number{
        let lootNode = this.lootNodes.get('root.'+bag.startingNode);

        if(!lootNode){
            throw 'Invalid loot starting node root.'+bag.startingNode;
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
        let roll = Math.random() * this.rarity;
console.log('roll',roll,'rarity',this.rarity,'node',this.node);
        for(let i=0;i<this.children.length;i++){
            const child = this.children[i];
console.log('roll/rarity',roll+'/'+child.rarity,child.node);
            if(child.rarity > roll){

                return child;
            }

            roll -= child.rarity;
        }

        throw 'returned null, NOOOOOO!';
    }

    addChild(node:LootNode){
        this.children.push(node);

        this.children.sort(function(a,b){
            return a.rarity - b.rarity;
        });

        this.updateRarity();

        let parent:LootNode = this;

        while(parent.hasParent()){
            parent = parent.parent;

            parent.updateRarity();
        }
    }

    updateRarity(){
        this.rarity = 0;

        for(let i=0;i<this.children.length;i++){
            this.rarity += this.children[i].rarity;
        }
    }
}



const test = new LootGenerator();

test.addLootItem('common.weapons.physical',HandAxe,0.5);
test.addLootItem('common.weapons.physical',WoodShield,0.5);
test.addLootItem('common.weapons.physical',HuntingSword,0.4);
test.addLootItem('common.equipment.armor',WornLeathers,0.4);
test.addLootItem('uncommon.weapons.tablets',TabletOfHealing,0.2);
test.addLootItem('uncommon.weapons.tablets',TabletOfPoison,0.2);
test.addLootItem('rare.weapons.thunder',SonicLongsword,0.05);
test.addLootItem('rare.weapons.physical',StoneAxe,0.05);
test.addLootItem('uncommon.weapons.physical',StoneDagger,0.15);
test.addLootItem('common.consumables',Vial,0.8);
test.addLootItem('common.herbs',Sage,0.5);
test.addLootItem('common.herbs',Yerba,0.5);
test.addLootItem('common.herbs',Bane,0.5);
test.addLootItem('common.herbs',Fox,0.5);
test.addLootItem('common.herbs',Acai,0.5);


for(var i=0;i<10;i++){
    const loot = test.generateLoot({
        startingNode: 'common',
        chanceToGenerate: 1,
        chanceToGoUp: 0,
        maxStepsUp: 5,
        magicFind: 0
    });

    console.log(loot ? ItemId[loot] : 'no loot generated');
}