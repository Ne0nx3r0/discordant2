import SocketServer from './socket/SocketServer';
import Logger from './log/Logger';
import DatabaseService from './db/DatabaseService';
import Game from './game/Game';

class DiscordantGameServer {
    public static main(): number {
        const logger = new Logger();

        //Adds a database transport so we "start" the logger after 
        const dbService = new DatabaseService();

        //

        const game = new Game({
            db: dbService
        });

        const socketServer = new SocketServer({
            port: 3000
        });
        
        return 0;
    }
}

DiscordantGameServer.main();

process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: \n" + err.stack);
});