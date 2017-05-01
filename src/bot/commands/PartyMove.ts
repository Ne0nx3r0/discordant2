import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import { PartyMoveDirection } from "../../core/party/PartyExploringMap";

const MOVE_DIRECTIONS_GEO = ['N','S','E','W'];
const MOVE_DIRECTIONS = ['U','D','L','R'];

export default class PartyMove extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'partymove',
            description: 'Move the party',
            usage: 'partymove <up|down|left|right> [#steps]',
            permissionNode: PermissionId.PartyMove,
            minParams: 1,
        });

        this.aliases.set('pmove','partymove');
        this.aliases.set('pm','partymove');
        this.aliases.set('party move','partymove');
        this.aliases.set('partym','partymove');
    }

    async run(bag:CommandRunBag){
        let direction = bag.params[0].substr(0,1).toUpperCase();
        let steps = parseInt(bag.params[1]);

        if(isNaN(steps) || steps < 1){
            steps = 1;
        }

        if(MOVE_DIRECTIONS.indexOf(direction) == -1 && MOVE_DIRECTIONS_GEO.indexOf(direction) == -1){
            throw `Invalid direction, valid directions: ${MOVE_DIRECTIONS.join(',')} and ${MOVE_DIRECTIONS_GEO.join(',')}`;
        }

        //translate to coordinal(?) direction
        if(MOVE_DIRECTIONS_GEO.indexOf(direction) != -1){
            direction = MOVE_DIRECTIONS[MOVE_DIRECTIONS_GEO.indexOf(direction)];
        }
        
        const pc = await bag.socket.getPlayer(bag.message.author.id);

        if(!pc.partyChannelId){
            throw 'You are not in a party';
        }

        if(pc.partyChannelId != bag.message.channel.id){
            throw 'Your party is at <#'+pc.partyChannelId+'>';
        }

        await bag.socket.moveParty(
            bag.message.author.id,
            direction as PartyMoveDirection,
            steps
        );        
    }
}