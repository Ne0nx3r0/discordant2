import { SocketPlayerCharacter } from '../creature/player/PlayerCharacter';
import PlayerCharacter from '../creature/player/PlayerCharacter';

const PVP_INVITE_TIMEOUT = 30000;

export {PVP_INVITE_TIMEOUT}

export interface PvPInvite{
    sender: PlayerCharacter;
    receiver: PlayerCharacter;
    expires: number;
}

export interface SocketPvPInvite{
    sender: SocketPlayerCharacter;
    receiver: SocketPlayerCharacter;
}