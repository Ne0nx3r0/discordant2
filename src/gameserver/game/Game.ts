import DatabaseService from '../db/DatabaseService';

export interface GameServerBag{
    db:DatabaseService;
}

export default class GameServer{
    db:DatabaseService;

    constructor(bag:GameServerBag){
        this.db = bag.db;
    }
}