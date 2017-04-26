import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import Weapon from "../../core/item/Weapon";
import WeaponAttack from '../../core/item/WeaponAttack';

export default class BattleAttack extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'attack',
            description: '(during battle) send an attack',
            usage: 'attack',
            permissionNode: PermissionId.BattleAttack,
            minParams: 0,
        });

        this.aliases.set('a','attack');
    }

    async run(bag:CommandRunBag){
        const player = await bag.socket.getPlayer(bag.message.author.id);

        if(player.status != 'inBattle'){
            throw 'You are not currently in a battle';
        }

        if(bag.message.channel.id != player.battleChannelId){
            throw `Your battle is in <#${player.battleChannelId}>`;
        }

        const wantedAttackStr = bag.params.join(' ').toUpperCase();

        const primaryWeaponId = player.equipment.weapon;
        const primaryWeapon = bag.items.get(primaryWeaponId) as Weapon;
        let attack:WeaponAttack;
        
        if(bag.params.length == 0){
            attack = primaryWeapon.attacks[0];
        }
        else{
            attack = primaryWeapon.findAttack(wantedAttackStr);
        } 

        if(!attack){
            let validAttacks = '';

            primaryWeapon.attacks.forEach((attack)=>{
                validAttacks += ', '+attack.title;
            });

            bag.message.channel.sendMessage(wantedAttackStr+' is not a valid attack, '+bag.message.author.username+'. '+primaryWeapon.title+' has: '+validAttacks.substr(2));

            return;
        }

        await bag.socket.sendBattleAttack(
            player.uid,
            attack.title,
            false
        );

        bag.message.delete();
    }
}