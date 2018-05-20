import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import ItemUsable from '../ItemUsable';
import PlayerCharacter from '../../creature/player/PlayerCharacter';
import WishCalc from '../../../bot/commands/WishCalc';
import { PartyStatus } from '../../party/PlayerParty';

export const GoldenCompass = new ItemUsable({
    id: ItemId.GoldenCompass,
    title: 'Golden Compass',
    description: 'write when not drunk',
    goldValue: 1000,
    canUseInbattle: false,
    canUseInParty: true,
    isConsumed: false,
    canUse: function(user:PlayerCharacter,target:PlayerCharacter){
        if(user.party && user.party.status == PartyStatus.Exploring){
            if(user.party.exploration.mapHasAPetSpawned()){
                return true;
            }
        }
        return false;
    },
    onUse: function(user:PlayerCharacter,target:PlayerCharacter):string{
        if(!user.party.exploration.mapHasAPetSpawned()){
            return `The compass indicates something interesting is ${getDistanceMessage(user)}`;
        }
        return "The compass dims and reveals nothing of importance.";
    }
});

function getDistanceMessage(user:PlayerCharacter){
    const userX = user.party.exploration.currentX;
    const userY = user.party.exploration.currentY;
    const petX = user.party.exploration.spawnedPet.x;
    const petY = user.party.exploration.spawnedPet.y;

    const differenceX = petX - userX;
    const differenceY = petY - userY;

    return userX+' '+userY+' '+petX+' '+petY+' '+differenceX+' '+differenceY;
}