import ClientRequest from '../ClientRequest';
import { TextChannel } from 'discord.js';
import { ClientRequestData, ClientRequestReceiveBag } from '../ClientRequest';
import { SocketCreature } from '../../core/creature/Creature';
import IDamageSet from '../../core/damage/IDamageSet';
import { getDamagesLine, getEmbed, EMBED_COLORS } from '../../bot/util/ChatHelpers';

export interface IAttackedSocket{
    creature: SocketCreature;
    damages: IDamageSet;
    blocked: boolean;
    exhaustion: number;
}

export interface ClientRequestAttackedData extends ClientRequestData{
    attacker: SocketCreature;
    message: string;
    attacked: Array<IAttackedSocket>;
}

export default class AttackedClientRequest extends ClientRequest{
    constructor(data:ClientRequestAttackedData){
        super('Attacked',data);
    }
    
    async receive(bag:ClientRequestReceiveBag,data:ClientRequestAttackedData):Promise<void>{
        let embed = data.message;

        data.attacked.forEach(function(attacked){
            if(Object.keys(attacked.damages).length > 0){
                embed += '\n'+getDamagesLine(
                    attacked.creature,
                    attacked.damages,
                    attacked.blocked,
                    attacked.exhaustion
                );
            }
        });

        bag.channel.sendMessage('',getEmbed(embed,EMBED_COLORS.DANGER));
    }
}