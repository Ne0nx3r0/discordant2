import Config from '../../Config.Bot';
import SocketClient from '../client/SocketClient';
import PermissionsService from '../core/permissions/PermissionService';
import Bot from './Bot';
import { BotConfig } from './Bot';
import Logger from '../gameserver/log/Logger';

class DiscordantBotNode {
    public static main(): number {
        console.log('Bot');

        const logger = new Logger();

        const permissions:PermissionsService = new PermissionsService();

        const socket:SocketClient = new SocketClient({
            gameserver: Config.gameserver,
            permissions: permissions
            logger: logger,
        });

        const bot:Bot = new Bot({
            permissions: permissions,
            authToken: Config.authToken,
            ownerUIDs: Config.ownerUIDs,
            commandPrefix: Config.commandPrefix,
            socket:socket
        });

        return 0;
    }
}
                                                          
DiscordantBotNode.main();

process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: \n" + err.stack);
  console.error(err);
});