import SocketServer from './socket/SocketServer';
import Logger from './log/Logger';
import DatabaseService, { DBConfig } from './db/DatabaseService';
import Game from './game/Game';
import GameServerConfig from '../../Config.GameServer';
import PermissionsService from '../core/permissions/PermissionService';
import { GameServerBag } from './game/Game';


export interface GameServerConfig{
    dbConfig:DBConfig;
    port:number;
}

class DiscordantGameServer {
    public static main(): number {
        console.log('Gameserver');

        const logger = new Logger();

        //Adds a database transport so we "start" the logger after 
        const db = new DatabaseService(logger,GameServerConfig.dbConfig);

        const permissions = new PermissionsService();

        const game = new Game({
            db: db,
            permissions: permissions,
        });

        const socketServer = new SocketServer({
            game: game,
            port: GameServerConfig.port,
            logger: logger,
        });
        
        return 0;
    }
}

DiscordantGameServer.main();

process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: \n" + err.stack);
});