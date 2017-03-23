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

    _send(sioc:SocketIOClient.Socket):Promise<ServerResponse>{
        return new Promise(function(resolve,reject){
            try{
                sioc.emit(this.title,this.data,function(response:ServerResponse){
                    if(response.success){
                        resolve(response);
                    }
                    else{
                        reject(response.error);
                    }
                });
            }
            catch(ex){
                reject(ex);
            }
        });
    }

    async receive(bag:ServerRequestRunBag):Promise<ServerResponse>{
        throw this.title +' does not implement receive';
    }
}