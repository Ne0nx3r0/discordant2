import IDamageSet from '../../core/damage/IDamageSet';
import { SocketCreature } from '../../core/creature/Creature';
export const EMBED_COLORS = {
    INFO: 0x3D79DB,
    ACTION: 0xCE790A,
    DANGER: 0xCE4E09,
    POISON: 0x6D066A,
    ERROR: 0xAA1100,
    TEST: 0xE1F4EF,
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
        case 'physical': return ':crossed_swords:';
        case 'fire': return ':fire:';
        case 'cold': return ':snowflake:';
        case 'thunder': return ':cloud_lightning:';
        case 'chaos': return ':sparkles:';
    }

    return ':question:';
}

export function getDamagesLine(creature:SocketCreature,damages:IDamageSet,blocked:boolean,exhausted:number){
    let blockedStr = '';
    let exhaustedStr = '';

    if(blocked){
        blockedStr = ' BLOCKED';
    }

    if(exhausted>1){
        exhaustedStr = ' EXHAUSTED ('+exhausted+')';
    }

    var line = '**'+creature.title+'**'+exhaustedStr+' ('+creature.hpCurrent+'/'+creature.stats.hpTotal+')'+blockedStr+' took damage ';
    
    Object.keys(damages).forEach(function(damageStr:string){
        line += damages[damageStr] + ' ' + getDamageTypeEmoji(damageStr) + '   ';
    });

    return line.slice(0,-3);
}