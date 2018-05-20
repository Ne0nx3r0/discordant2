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
            return `The compass indicates ${getDistanceMessage(user)}`;
        }
        return "The compass dims and reveals nothing of importance.";
    }
});

function getDistanceMessage(user:PlayerCharacter):string{
    const userX = user.party.exploration.currentX;
    const userY = user.party.exploration.currentY;
    const petX = user.party.exploration.spawnedPet.x;
    const petY = user.party.exploration.spawnedPet.y;

    const differenceX = petX - userX;
    const differenceY = petY - userY;

    if(differenceX === 0 && differenceY === 0){
        return "right on top of you!";
    }
    
    if(differenceX === 0){
        return getDistanceWord(differenceY)+" "+getDirectionWordNS(differenceY);
    }
    
    if(differenceY === 0){
        return getDistanceWord(differenceX)+" "+getDirectionWordEW(differenceX);
    }

    return getDistanceWord(differenceY)+" "+getDirectionWordNS(differenceY)
    +" and "+getDistanceWord(differenceX)+" "+getDirectionWordEW(differenceX);
}

function getDirectionWordNS(differenceY:number){
    if(differenceY > 0){
        return "south";
    }
    return "north";
}

function getDirectionWordEW(differenceX:number){
    if(differenceX > 0){
        return "east";
    }
    return "west";    
}

function getDistanceWord(distance:number):string{
    const distanceAbs = Math.abs(distance);

    if(distanceAbs < 5){
        return "slightly";
    }
    else if(distanceAbs < 10){
        return "a ways";
    }
    return "far";
}