import { SocketPlayerCharacter } from '../creature/player/PlayerCharacter';
import PlayerCharacter from '../creature/player/PlayerCharacter';

export interface PvPInvite{
    sender: PlayerCharacter;
    receiver: PlayerCharacter;
}

export interface SocketPvPInvite{
    sender: SocketPlayerCharacter;
    receiver: SocketPlayerCharacter;
}