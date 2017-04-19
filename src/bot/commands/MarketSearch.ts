import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import GetEarnedWishes from '../../util/GetEarnedWishes';
import MarketOfferEncoder from '../../util/MarketOfferEncoder';

export default class MarketStop extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'marketsearch',
            description: 'Search for an item in the market',
            usage: 'marketsearch <item name>',
            permissionNode: PermissionId.MarketSearch,
            minParams: 1,
        });

        this.aliases = ['msearch','ms'];
    }

    async run(bag:CommandRunBag){
        const offerSid = bag.params[0];
        const offerId = MarketOfferEncoder.decode(offerSid);

        const response = await bag.socket.marketStop(bag.message.author.id,offerId);
        const item = bag.items.get(response.item);

        bag.message.channel.sendMessage(`${offerSid} stopped, received ${response.amount} ${item.title} that did not sell.`);
    }
}