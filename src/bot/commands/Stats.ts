import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import PlayerCharacter from '../../core/creature/player/PlayerCharacter';
import { MessageOptions } from "discord.js";
import { SocketPlayerCharacter } from '../../core/creature/player/PlayerCharacter';
import AllItems from '../../core/item/AllItems';
import { XPToLevel } from "../../util/XPToLevel";
import { GetLuckXPBonus } from '../../util/GetLuckXPBonus';
import * as moment from 'moment';

export default class Begin extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'stats',
            description: 'Check stats',
            usage: 'stats [\@user]',
            permissionNode: PermissionId.Stats,
            minParams: 0,
        });
    }

    async run(bag:CommandRunBag){
        let tagUserId;
        
        if(bag.params.length == 0){
            tagUserId = bag.message.author.id;
        }
        else{
            tagUserId = this.getUserTagId(bag.params[0]);
        }

        if(!tagUserId){
            bag.message.channel.send(this.getUsage());
            
            return;
        }

        let player;

        if(tagUserId == bag.message.author.id){
            player = await bag.socket.getPlayer(tagUserId,bag.message.author.username);
        }
        else{
            player = await bag.socket.getPlayer(tagUserId);
        }

        if(!player){
            throw 'Player not found';
        }

        bag.message.channel.send("",getEmbed(player,bag.items) as MessageOptions);
    }
}

function getEmbed(pc:SocketPlayerCharacter,items:AllItems){
    let wishBonusStr = '';

    if(pc.stats.wishBonus > 0){
        wishBonusStr = ' (+'+Math.round(pc.stats.wishBonus*100)+'% Wishes)';
    }

    let dodgeStr = '';

    if(pc.stats.dodge > 0){
        dodgeStr = ' ('+pc.stats.dodge+' Dodge)';
    }

    const pcAttributesStr = ''
         +pc.stats.strength+' Strength,'
    +' '+pc.stats.agility+' Agility'+dodgeStr+','
    +'\n'+pc.stats.vitality+' Vitality,'
    +' '+pc.stats.spirit+' Spirit,'
    +' '+pc.stats.luck+' Luck'+wishBonusStr;

    const resistancesStr = ''
    +'\n'+Math.floor(pc.stats.resistances.physical)+' Physical'
    +'\n'+Math.floor(pc.stats.resistances.fire)+' Fire'
    +'\n'+Math.floor(pc.stats.resistances.thunder)+' Thunder'
    +'\n'+Math.floor(pc.stats.resistances.dark)+' Dark';

    function getEquipmentInSlot(slot:string){
        if(pc.equipment[slot]){
            return '\n'+items.get(pc.equipment[slot] as number).title+' ('+slot.substr(0,1).toUpperCase()+slot.substr(1)+')'; 
        }
        return '\n- ('+slot.substr(0,1).toUpperCase()+slot.substr(1)+')';
    }

    const equipmentStr = getEquipmentInSlot('hat')
    +getEquipmentInSlot('amulet')
    +getEquipmentInSlot('armor')
    +getEquipmentInSlot('ring')
    +getEquipmentInSlot('pouch');

    return {
        embed: {
            color: 3447003,
            author: {
                name: 'Stats for '+pc.title,
                icon_url: 'http://dsi-vd.github.io/patternlab-vd/images/fpo_avatar.png'
            },
            description: pc.description?pc.description:'',
            fields: [
                {
                    name: 'Health Points',
                    value: pc.hpCurrent + ' / ' + pc.stats.hpTotal,
                    inline: true,
                },
                {
                    name: 'Level',
                    value: pc.level,
                    inline: true,
                },
                {
                    name: 'Wishes',
                    value: `${pc.wishes} / ${XPToLevel[pc.level]}`,
                    inline: true,
                },
                {
                    name: 'Gold',
                    value: pc.gold,
                    inline: true,
                },                
                {
                    name: 'Magic Find',
                    value: pc.stats.magicFind,
                    inline: true,
                },            
                {
                    name: 'Karma',
                    value: pc.karma,
                    inline: true,
                },            
                {
                    name: 'Stalls',
                    value: pc.stalls,
                    inline: true,
                },            
                {
                    name: 'Active Pet',
                    value: '-',
                    inline: true,
                },
                {
                    name: 'Weapons',
                    value: `${items.get(pc.equipment.weapon || 0).title} (Primary)
${items.get(pc.equipment.offhand || 0).title} (Offhand)`,
                    inline: true,
                },
                {
                    name: 'Attributes',
                    value: pcAttributesStr,
                    inline: true,
                },
                {
                    name: 'Resistances',
                    value: resistancesStr,
                    inline: true,
                },
                {
                    name: 'Equipment',
                    value: equipmentStr,
                    inline: true,
                },
                {
                    name: 'Joined',
                    value: moment(pc.joinedDateStr).format('MMMM Do YYYY, h:mm a'),
                    inline: true,
                },   
            ]
        }
    }
}