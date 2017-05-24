import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import ItemUsable from '../ItemUsable';
import PlayerCharacter from '../../creature/player/PlayerCharacter';
import WishCalc from '../../../bot/commands/WishCalc';

export const Revive = new ItemUsable({
    id: ItemId.Revive,
    title: 'Revive',
    description: '(Revives a defeated ally during battle to 50HP) Once marketed as "salvation in a bottle", the intense healing properties of this vial will almost immediately bring even the most wounded of soldiers back to health.',
    goldValue: 50,
    buyCost: 100,
    canUseInbattle: true,
    canUseInParty: false,
    battleExhaustion: 1,
    canUse: function(user:PlayerCharacter,target:PlayerCharacter){
        if(!target.battle.participantsLookup.get(target).defeated){
            throw `${target.title} has not been defeated yet!`;
        }
    },
    onUse: function(user:PlayerCharacter,target:PlayerCharacter):string{
        target.battle.revive(target,50);

        return `${target.title} has been revived with 50HP!`;
    }
});