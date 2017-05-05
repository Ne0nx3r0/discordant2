import IDamageSet from '../../core/damage/IDamageSet';
import { SocketCreature } from '../../core/creature/Creature';
export const EMBED_COLORS = {
    INFO: 0x3D79DB,
    ACTION: 0xCE790A,
    DANGER: 0xCE4E09,
    POISON: 0x6D066A,
    ERROR: 0xAA1100,
    TEST: 0xE1F4EF,
    BOOST: 0xB4FAB4,
}/*
export const EMBED_COLORS = {
    newRound: 0xFFA500,
    victorious: 0xFFA500,
    attack: 0xFFA500,
    defeated: 0x000000,
};*/

export function getEmbed(msg:string,color?:number){
    return {
        embed: {
            color: color || 0xFFFFFF, 
            description: msg,           
        }
    }
}

export function getDamageTypeEmoji(type:string){
    switch(type){
        case 'physical': return 'PHYSICAL';//':crossed_swords:';
        case 'fire': return 'FIRE';//:fire:';
        case 'cold': return 'COLD';//':snowflake:';
        case 'thunder': return 'THUNDER';//':cloud_lightning:';
        case 'chaos': return 'CHAOS';//':sparkles:';
    }

    return 'UNKNOWN DAMAGE TYPE';
}

export function getDamagesLine(creature:SocketCreature,damages:IDamageSet,blocked:boolean,exhausted:number,isCritical:boolean){
    let blockedStr = '';

    if(blocked){
        blockedStr = ' \*blocked\* ';
    }

    var line = creature.title+blockedStr;

    Object.keys(damages).forEach(function(damageStr:string){
        line += ' hit with '+damages[damageStr] + ' ' + getDamageTypeEmoji(damageStr) + ' damage';
    });

    return line;
}