import ClientRequest from '../ClientRequest';
import { TextChannel } from 'discord.js';
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
            const resultMessage = await bag.channel.sendFile(data.imageSrc,data.locationName+'.png',data.message);

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