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
            name: 'marketshop',
            description: 'Search for an item in the market',
            usage: 'marketshop <item name>',
            permissionNode: PermissionId.MarketSearch,
            minParams: 1,
        });

        this.aliases = ['msearch','ms'];
    }

    async run(bag:CommandRunBag){
        const itemName = bag.params.join(' ');

        const item = bag.items.findByName(itemName);

        if(!item){
            throw `Unknown item "${itemName}"`;
        }

        const marketOffers:Array<SocketActiveMarketOffer> = await bag.socket.marketGetOffers(item.id);

        let msg = `Current offers for ${item.title}:\n\n`;

        msg += marketOffers.map(function(offer){
            const offerSid = MarketOfferEncoder.encode(offer.id);

            return `${offerSid} ${offer.price}GP each (${offer.amountLeft} left, ${offer.price*offer.amountLeft}GP buyout)`;
        }).join('\n');

        bag.message.channel.sendMessage(msg);
    }
}