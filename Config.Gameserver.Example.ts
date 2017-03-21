import { GameServerConfig } from './src/gameserver/Index';

const gameServerConfig:GameServerConfig = {
    dbConfig:{
        host: '127.0.0.1',
        port: 5432,
        user: 'userid',
        password: 'password',
        database: 'dbname',
        ssl:true,
    },
    port: 3000
}

export default gameServerConfig;