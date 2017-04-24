import ClientRequest from '../ClientRequest';
import { TextChannel } from 'discord.js';
import { ClientRequestData, ClientRequestReceiveBag } from '../ClientRequest';
import { SocketCreature } from '../../core/creature/Creature';

export interface ClientRequestRoundBeginData extends ClientRequestData{
    team1: Array<SocketCreature>;
    team2: Array<SocketCreature>;
}

export default class RoundBeginRequest extends ClientRequest{
    constructor(data:ClientRequestRoundBeginData){
        super('RoundBegin',data);
    }
    
    async receive(bag:ClientRequestReceiveBag,data:ClientRequestRoundBeginData):Promise<void>{
        const team1Msg = data.team1.map(function(c){
            return `${c.title} (${c.hpCurrent}/${c.stats.hpTotal})`;
        }).join(', ');

        const team2Msg = data.team2.map(function(c){
            return `${c.title} (${c.hpCurrent}/${c.stats.hpTotal})`;
        }).join(', ');

        bag.channel.sendMessage('```css\n--- NEW ROUND ---\n```\n'+team1Msg+'\n'+team2Msg);
    }
}