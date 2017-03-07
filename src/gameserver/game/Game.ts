import DatabaseService from '../db/DatabaseService';

export interface GameServerBag{
    db:DatabaseService;
}

export default class Game{
    db:DatabaseService;

    constructor(bag:GameServerBag){
        this.db = bag.db;
    }
}