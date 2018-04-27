import { BotConfig } from './src/bot/Bot';

const gameServerConfig:BotConfig = {
    authToken:'authToken',
    ownerUIDs:['ownerUID'],
    commandPrefix:'!',
    gameserver: 'ws://localhost:3000',
    production: false,
    uids:{
        canSeePartyChannels: [
            // '304251507874856962',
        ],
    },
}

export default gameServerConfig;