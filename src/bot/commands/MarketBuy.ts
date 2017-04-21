import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import MarketOfferEncoder from '../../util/MarketOfferEncoder';

export default class MarketBuy extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'marketbuy',
            description: 'Purchase an offer on the market',
            usage: 'marketbuy <offerId>',
            permissionNode: PermissionId.MarketBuy,
            minParams: 1,
        });

        this.aliases.set('mbuy','marketbuy');
    }

    async run(bag:CommandRunBag){
        const offerSid = bag.params[0];
        const offerId = MarketOfferEncoder.decode(offerSid);

        
    }
}