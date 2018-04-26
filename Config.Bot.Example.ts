import { BotConfig } from './src/bot/Bot';

const gameServerConfig:BotConfig = {
    authToken:'authToken',
    ownerUIDs:['ownerUID'],
    commandPrefix:'!',
    gameserver: 'ws://localhost:3000',
    production: false,
    partiesChannelCategoryId: '',
}

export default gameServerConfig;