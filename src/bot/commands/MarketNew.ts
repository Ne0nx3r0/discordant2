import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import GetEarnedWishes from '../../util/GetEarnedWishes';
import MarketOfferEncoder from '../../util/MarketOfferEncoder';
import { SocketActiveMarketOffer } from "../../gameserver/db/api/DBGetActiveMarketOffers";
import Challenge from './Challenge';

export default class MarketNew extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'marketnew',
            description: 'Search for an item in the market',
            usage: 'marketnew [page #]',
            permissionNode: PermissionId.MarketNew,
            minParams: 0,
        });

        this.aliases = ['mnew','mn'];
    }

    async run(bag:CommandRunBag){
        let page = parseInt(bag.params[0]);

        if(isNaN(page)){
            page = 1;
        }
        else if(page > 10){
            throw 'You can only view 10 pages back';
        }

        const marketOffers:Array<SocketActiveMarketOffer> = await bag.socket.getNewestActiveMarketOffers(page);

        let msg = `Newest for sale offers:\n\n`;

        msg += marketOffers.map(function(offer){
            const offerSid = MarketOfferEncoder.encode(offer.id);
            const itemName = bag.items.get(offer.item).title;

            return `${offerSid} ${itemName} ${offer.price}GP each (${offer.amountLeft} left, ${offer.price*offer.amountLeft}GP buyout)`;
        }).join('\n');

        bag.message.channel.sendMessage(msg);
    }
}