import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';

export default class Begin extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'begin',
            description: 'Start your adventure!',
            usage: 'begin [className]',
            permissionNode: PermissionId.Begin
        });
    }

    run(bag:CommandRunBag){
        if(bag.player){
            bag.message.channel.sendMessage('You are already registered, '+bag.player.title);
            
            return;
        }

        bag.message.channel.sendMessage('Ready to do it');
    }
}