import ClientRequest from '../ClientRequest';
import { TextChannel } from 'discord.js';
import { ClientRequestData, ClientRequestReceiveBag } from '../ClientRequest';
import { SocketCreature } from '../../core/creature/Creature';
import { ISocketBattleCreature } from '../../core/battle/CreatureBattle';

export interface ClientRequestRoundBeginData extends ClientRequestData{
    participants: Array<ISocketBattleCreature>;
}

export default class RoundBeginClientRequest extends ClientRequest{
    constructor(data:ClientRequestRoundBeginData){
        super('RoundBegin',data);
    }
    
    async receive(bag:ClientRequestReceiveBag,data:ClientRequestRoundBeginData):Promise<void>{
        function formatbc(bc:ISocketBattleCreature){
            const blocking = bc.blocking ? ' | Blocking' : '';
            const charges = bc.charges>0?' | Charges: '+bc.charges:'';
            let exhausted = '';
            const prefix = bc.defeated ? '- ' : '+ ';
            const creatureTitle = bc.creature.title+' '+bc.creature.hpCurrent+'/'+bc.creature.stats.hpTotal;

            if(bc.creature.id == -1){
                exhausted = bc.exhaustion > 1 ? ' | Exhausted' : '';
            }

            return prefix+creatureTitle+charges+blocking+exhausted;
        }

        const team1Msg = data.participants
        .filter(function(bc){
            return bc.teamNumber == 1;
        })
        .map(formatbc)
        .join(', ');

        const team2Msg = data.participants
        .filter(function(bc){
            return bc.teamNumber == 2;
        })
        .map(formatbc)
        .join(', ');

        bag.channel.sendMessage('```diff\n--- NEW ROUND ---\n'+team1Msg+'\n\n'+team2Msg+'```');
    }
}