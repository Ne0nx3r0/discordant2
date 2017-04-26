import ClientRequest from '../ClientRequest';
import { TextChannel } from 'discord.js';
import { ClientRequestData, ClientRequestReceiveBag } from '../ClientRequest';
import { SocketCreature } from '../../core/creature/Creature';
import { ISocketBattleCreature } from "../../core/battle/CreatureBattle";

export interface ClientRequestRoundBeginData extends ClientRequestData{
    participants: Array<ISocketBattleCreature>;
}

export default class RoundBeginClientRequest extends ClientRequest{
    constructor(data:ClientRequestRoundBeginData){
        super('RoundBegin',data);
    }
    
    async receive(bag:ClientRequestReceiveBag,data:ClientRequestRoundBeginData):Promise<void>{
        const team1Msg = data.participants
        .filter(function(bc){
            return bc.teamNumber == 1;
        })
        .map(function(bc){
            return `${bc.creature.hpCurrent}/${bc.creature.stats.hpTotal} ${bc.creature.title}`;
        })
        .join(', ');

        const team2Msg = data.participants
        .filter(function(bc){
            return bc.teamNumber == 2;
        })
        .map(function(bc){
            return `${bc.creature.hpCurrent}/${bc.creature.stats.hpTotal} ${bc.creature.title}`;
        })
        .join(', ');

        bag.channel.sendMessage('```css\n--- NEW ROUND ---\n```\n'+team1Msg+'\n\n'+team2Msg);
    }
}