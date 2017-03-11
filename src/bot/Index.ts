import Config from '../../Config.Bot';
import SocketClient from '../client/SocketClient';
import PermissionsService from '../core/permissions/PermissionService';
import Bot from './Bot';
import { BotConfig } from './Bot';

class DiscordantBotNode {
    public static main(): number {
        const permissions:PermissionsService = new PermissionsService();

        const socket:SocketClient = new SocketClient({
            permissions: permissions,
            gameserver: Config.gameserver
        });

        const bot:Bot = new Bot({
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
});