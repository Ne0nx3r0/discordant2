import ClientRequest from '../ClientRequest';
import { TextChannel, Message } from 'discord.js';
import { ClientRequestData, ClientRequestReceiveBag } from '../ClientRequest';
import { SocketClientBag } from '../SocketClientRequester';
import SetSliceRemoteUrlRequest from '../../gameserver/socket/requests/SetSliceRemoteUrlRequest';

export interface ClientRequestSendLocalImageData extends ClientRequestData{
    imageSrc: string;
    message: string;
    locationName: string;
}

export default class SendLocalImageClientRequest extends ClientRequest{
    constructor(data:ClientRequestSendLocalImageData){
        super('SendLocalImage',data);
    }
    
    async receive(bag:ClientRequestReceiveBag,data:ClientRequestSendLocalImageData):Promise<void>{
        try{
            const resultMessage:Message = await bag.channel.send(data.message,{
                file:{
                    attachment: data.imageSrc,
                    name: data.locationName+'.png',
                }
            }) as Message;

            const cacheUrl = resultMessage.attachments.first().url;      

            new SetSliceRemoteUrlRequest({
                imageSrc: data.imageSrc,
                remoteUrl: cacheUrl,
            })
            .send(bag.sioc);          
        }
        catch(ex){
            const did = bag.logger.error(ex);

            throw `error loading map image ${did}`;
        }
    }
}