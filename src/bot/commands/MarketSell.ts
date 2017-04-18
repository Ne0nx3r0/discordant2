import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import GetEarnedWishes from '../../util/GetEarnedWishes';
import MarketOfferEncoder from '../../util/MarketOfferEncoder';

export default class MarketSell extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'marketsell',
            description: 'Put an item for sale in the market',
            usage: 'marketsell <item name> <amount> <price>',
            permissionNode: PermissionId.MarketSell,
            minParams: 3,
        });

        this.aliases = ['msell'];
    }

    async run(bag:CommandRunBag){
        const amount = parseInt(bag.params[bag.params.length-2]);
        const price = parseInt(bag.params[bag.params.length-1]);
        const itemName = bag.params.slice(0,-2).join(' ').toUpperCase();

        if(isNaN(amount) || isNaN(price) || amount < 1 || price < 1){
            bag.message.channel.sendMessage(this.getUsage());

            return;
        }

        const item = bag.items.findByName(itemName);

        if(!item){
            throw `Unknown item "${item.title}"`;
        }

        const offerId = await bag.socket.marketSell({
            uid: bag.message.author.id,
            item: item.id,
            amount: amount,
            price: price,
        });

        const offerSid = MarketOfferEncoder.encode(offerId);

        bag.message.channel.sendMessage(`You put ${amount} ${item.title} for sale at ${price}gp each ( ${offerSid} )`);
    }
}