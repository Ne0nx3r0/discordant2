import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import GetEarnedWishes from '../../util/GetEarnedWishes';
import MarketOfferEncoder from '../../util/MarketOfferEncoder';
import { SocketActiveMarketOffer } from "../../gameserver/db/api/DBGetActiveMarketOffers";
import * as moment from 'moment';

export default class MarketSearch extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'marketoffer',
            description: 'View the details of a market offer',
            usage: 'marketoffer <id>',
            permissionNode: PermissionId.MarketOffer,
            minParams: 1,
        });

        this.aliases.set('moffer','marketoffer');
        this.aliases.set('mo','marketoffer');
    }

    async run(bag:CommandRunBag){
        const offerSid = bag.params[0];
        const offerId = MarketOfferEncoder.decode(offerSid);

        if(!offerId){
            throw 'Invalid market offer id';
        }

        const offer = await bag.socket.getMarketOffer(offerId);
        const offerItem = bag.items.get(offer.item);

        bag.message.channel.send(`Offer ${offerSid}
${offer.ended ? '\nENDED\n~~' : ''}${offer.amountLeft} ${offerItem.title} for sale at ${offer.price}GP each${offer.ended ? '~~' : ''}

Seller: ${offer.sellerTitle}
Posted: ${moment(new Date(offer.created)).format('MMM Do, YYYY @ hh:mm a')}
Last Updated: ${moment(new Date(offer.updated)).format('MMM Do, YYYY @ hh:mm a')}
`);
    }
}