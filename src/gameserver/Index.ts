import {createServer} from 'https';
import * as SocketIO from 'socket.io';
import {readFileSync} from 'fs';

class DiscordantGameServer {
    public static main(): number {
        const server = createServer({
            key: readFileSync('test/fixtures/keys/agent2-key.pem'),
            cert: readFileSync('test/fixtures/keys/agent2-cert.pem')
        });
        const io = SocketIO();

        io.on('connection', function(client){

        });

        io.listen(3000);

        return 0;
    }
}

DiscordantGameServer.main();

process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: \n" + err.stack);
});