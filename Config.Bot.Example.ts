import { BotConfig } from './src/bot/Bot';

const gameServerConfig:BotConfig = {
    authToken:'authToken',
    commandPrefix:'!',
    gameserver: 'ws://localhost:3000',
    production: false,
    uids:{
        canSeePartyChannels: [
            // '304251507874856962', // Community Managers
        ],
        owners:[
            // '185030740516405248' // SometimesiCode
        ],
    },
}

export default gameServerConfig;