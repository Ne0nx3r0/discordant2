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
            name: 'block',
            description: '(during battle) Block for a round',
            usage: 'block',
            permissionNode: PermissionId.BattleAttack,
            minParams: 0,
        });

        this.aliases = ['b'];
    }

    async run(bag:CommandRunBag){
        const player = await bag.socket.getPlayer(bag.message.author.id);

        if(player.status != 'inBattle'){
            throw 'You are not currently in a battle';
        }


        if(player.battleChannelId != bag.message.channel.id){
            throw 'Your battle is in <#'+player.battleChannelId+'>, ';
        }

        const wantedAttackStr = bag.params.join(' ').toUpperCase();

        await bag.socket.sendBattleBlock(player.uid);
    }
}