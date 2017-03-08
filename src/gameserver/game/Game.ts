import DatabaseService from '../db/DatabaseService';
import DBGetPlayerCharacter from '../db/api/DBGetPlayerCharacter';
import { SocketPlayer } from '../../core/socket/SocketRequests';

export interface GameServerBag{
    db: DatabaseService;
}

export default class Game{
    db: DatabaseService;
    cachedPCs: Map<string,SocketPlayer>;

    constructor(bag:GameServerBag){
        this.db = bag.db;
    }

    getPlayerCharacter(uid:string):Promise<SocketPlayer>{
        return DBGetPlayerCharacter(this.db,uid);
    }
}