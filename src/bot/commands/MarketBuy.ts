import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import MarketOfferEncoder from '../../util/MarketOfferEncoder';

export default class MarketBuy extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'marketbuy',
            description: 'Purchase an offer on the market',
            usage: 'marketbuy <offerId> <amount|all>',
            permissionNode: PermissionId.MarketBuy,
            minParams: 1,
        });

        this.aliases.set('mbuy','marketbuy');
    }

    async run(bag:CommandRunBag){
        const offerSid = bag.params[0];
        const offerId = MarketOfferEncoder.decode(offerSid);

        let amount;

        if(bag.params[1] == 'all'){
            amount = -1;
        }
        else if(!bag.params[1]){
            amount = 1;
        }
        else{
            amount = parseInt(bag.params[1]);

            if(isNaN(amount)){
                bag.message.channel.send(this.getUsage());

                return;
            }
        }

        const purchased = await bag.socket.buyMarketOffer(bag.message.author.id,offerId,amount);
        const item = bag.items.get(purchased.itemId);

        bag.message.channel.send(`Purchased ${purchased.amountPurchased} ${item.title} from offer ${offerSid} for ${purchased.totalCost}GP, ${bag.message.author.username}`);

        const suffix = purchased.amountLeft == 0 ? 'all items sold, offer ended!' : purchased.amountLeft+' left';

        bag.message.client.users.get(purchased.sellerUid).send(`${bag.message.author.username} (${bag.message.author.id}) bought ${purchased.amountPurchased} ${item.title} from offer ${offerSid}, ${suffix}`);
    }
}