import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import GetEarnedWishes from '../../util/GetEarnedWishes';
import MarketOfferEncoder from '../../util/MarketOfferEncoder';
import { SocketActiveMarketOffer } from "../../gameserver/db/api/DBGetActiveMarketOffers";
import Challenge from './Challenge';

export default class MarketSearch extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'marketsearch',
            description: 'Search for an item in the market',
            usage: 'marketsearch <item name>',
            permissionNode: PermissionId.MarketSearch,
            minParams: 1,
        });

        this.aliases.set('msearch','marketsearch');
        this.aliases.set('ms','marketsearch');
    }

    async run(bag:CommandRunBag){
        const itemName = bag.params.join(' ');

        const item = bag.items.findByName(itemName);

        if(!item){
            throw `Unknown item "${itemName}"`;
        }

        const marketOffers:Array<SocketActiveMarketOffer> = await bag.socket.marketGetOffers(item.id);


        if(!marketOffers){
            bag.message.channel.sendMessage(`No offers found`);

            return;    
        }

        let msg = `\`\`\`xml\nCurrent offers for ${item.title}\n`;

        msg += marketOffers.map(function(offer){
            const offerSid = MarketOfferEncoder.encode(offer.id);

            return `< ${offerSid} ${bag.items.get(offer.item).title} = ${offer.price}GP (${offer.amountLeft} left) >`;
        }).join('\n');
        
        bag.message.channel.sendMessage(msg+'```');
    }
}