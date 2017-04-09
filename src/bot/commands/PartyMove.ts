import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import { PartyMoveDirection } from "../../core/party/PartyExploringMap";

const MOVE_DIRECTIONS_GEO = ['N','S','W','E'];
const MOVE_DIRECTIONS = ['U','D','L','R'];

export default class PartyMove extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'partymove',
            description: 'Move the party',
            usage: 'partymove',
            permissionNode: PermissionId.PartyMove,
            minParams: 1,
        });

        this.aliases = ['move','pm'];
    }

    async run(bag:CommandRunBag){
        let direction = bag.params[0].substr(0,1).toUpperCase();

        if(MOVE_DIRECTIONS.indexOf(direction) == -1 && MOVE_DIRECTIONS_GEO.indexOf(direction) == -1){
            throw `Invalid direction, valid directions: ${MOVE_DIRECTIONS.join(',')} and ${MOVE_DIRECTIONS_GEO.join(',')}`;
        }

        //translate to coordinal(?) direction
        if(MOVE_DIRECTIONS_GEO.indexOf(direction) != -1){
            direction = MOVE_DIRECTIONS[MOVE_DIRECTIONS_GEO.indexOf(direction)];
        }

        bag.socket.moveParty(bag.message.author.id,direction as PartyMoveDirection);        
    }
}