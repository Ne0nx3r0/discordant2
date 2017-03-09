import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../permissions/PermissionId';

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
        
    }
}