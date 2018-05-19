import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import Weapon from "../../core/item/Weapon";
import WeaponAttack from '../../core/item/WeaponAttack';
import { BareHands } from '../../core/item/weapons/BareHands';
import { isNumber } from 'util';

export default class BattleAttack extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'attack',
            description: '(during battle) send an attack',
            usage: 'attack [attackName] [@user or slot #]',
            permissionNode: PermissionId.BattleAttack,
            minParams: 0,
        });

        this.aliases.set('a','attack');
    }

    async run(bag:CommandRunBag){
        await BotAttackCommand(bag,false);
    }
}

export async function BotAttackCommand(bag:CommandRunBag,offhand:boolean){
    const target = bag.message.mentions.users.first();
    let targetSlot:number;
    
    if(!target){
        const slotStr:number = Number(bag.params[bag.params.length-1]);
        
        if(!isNaN(slotStr)){
            if(slotStr < 1){
                throw `Invalid slot ${slotStr}`;
            }
            targetSlot = slotStr;
        }
    }

    const player = await bag.socket.getPlayer(bag.message.author.id);

    if(player.status != 'inBattle'){
        throw 'You are not currently in a battle';
    }

    if(bag.message.channel.id != player.battleChannelId){
        throw `Your battle is in <#${player.battleChannelId}>`;
    }

    const weaponId = offhand ? player.equipment.offhand : player.equipment.weapon;

    let weapon;

    if(!weaponId){
        weapon = BareHands;
    }
    else{
        weapon = bag.items.get(weaponId) as Weapon;
    }

    let attack:WeaponAttack;
    let wantedAttackStr;
    
    if(bag.params.length == 0 || (target || targetSlot) && bag.params.length == 1){
        attack = weapon.attacks[0];
    }
    else{
        wantedAttackStr = bag.params[0].toUpperCase();
        attack = weapon.findAttack(wantedAttackStr);
    }

    if(!attack){
        let validAttacks = weapon.attacks.map((attack)=>{
            return attack.title;
        }).join(', ');

        bag.message.channel.send(wantedAttackStr+' is not a valid attack, '+bag.message.author.username+'. '+weapon.title+' has: '+validAttacks);

        return;
    }

    if(targetSlot){
        await bag.socket.sendBattleAttackSlot(
            player.uid,
            targetSlot,
            attack.title,    
            offhand
        );  
    }
    else{
        await bag.socket.sendBattleAttackUID(
            player.uid,
            target?target.id:player.uid,
            attack.title,
            offhand
        );  
    }
}