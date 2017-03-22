import Game from '../game/Game';

export interface ServerRequestRunBag{
    game:Game;
}

export interface ServerRequestData{
    
}

export interface ServerResponse{
    success:boolean;
    error?:string;
}

export default class ServerRequest{
    title:string;
    data:ServerRequestData;

    constructor(title:string,data:ServerRequestData){
        this.title = title;
        this.data = data;
    }

    async run(bag:ServerRequestRunBag):Promise<ServerResponse>{
        throw this.title +' does not implement run';
    }
}