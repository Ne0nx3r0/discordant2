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
            name: 'marketstop',
            description: 'Put an item for sale in the market',
            usage: 'marketstop <offerId>',
            permissionNode: PermissionId.MarketStop,
            minParams: 1,
        });

        this.aliases.set('mstop','marketstop');
    }

    async run(bag:CommandRunBag){
        const offerSid = bag.params[0];
        const offerId = MarketOfferEncoder.decode(offerSid);

        const response = await bag.socket.marketStop(bag.message.author.id,offerId);
        const item = bag.items.get(response.item);

        bag.message.channel.send(`${offerSid} stopped, received ${response.amount} ${item.title} that did not sell.`);
    }
}