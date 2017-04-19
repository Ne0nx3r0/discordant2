import Config from '../../Config.Bot';
import PermissionsService from '../core/permissions/PermissionService';
import Bot from './Bot';
import { BotConfig } from './Bot';
import Logger from '../gameserver/log/Logger';
import * as SocketIOClient from 'socket.io-client';
import SocketClientRequester from '../client/SocketClientRequester';
import SocketClientListener from '../client/SocketClientListener';

class DiscordantBotNode {
    public static main(): number {
        console.log('Bot');

        const logger = new Logger();

        const permissions:PermissionsService = new PermissionsService(Config.production);

        const sioc = SocketIOClient(Config.gameserver);

        const socket:SocketClientRequester = new SocketClientRequester({
            sioc: sioc,
        });

        const bot:Bot = new Bot({
            permissions: permissions,
            authToken: Config.authToken,
            ownerUIDs: Config.ownerUIDs,
            commandPrefix: Config.commandPrefix,
            socket:socket,
            logger: logger,
        });

        const listener:SocketClientListener = new SocketClientListener({
            channelLookup: bot.getChannelById,
            sioc: sioc,
            logger: logger,
            socket: socket,
        });

        return 0;
    }
}
                                                          
DiscordantBotNode.main();

process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: \n" + err.stack);
  console.error(err);
});