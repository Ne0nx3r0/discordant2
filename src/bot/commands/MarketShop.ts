import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import GetEarnedWishes from '../../util/GetEarnedWishes';
import MarketOfferEncoder from '../../util/MarketOfferEncoder';
import { SocketActiveMarketOffer } from "../../gameserver/db/api/DBGetActiveMarketOffers";
import Challenge from './Challenge';
import { User } from "discord.js";

export default class MarketShop extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'marketshop',
            description: `View your items for sale or another player\'s`,
            usage: 'marketshop [@username]',
            permissionNode: PermissionId.MarketShop,
            minParams: 0,
        });

        this.aliases = ['mshop'];
    }

    async run(bag:CommandRunBag){
        let userShopId:string;
        let tagUser:User;

        if(bag.params.length == 0){
            tagUser = bag.message.author;
            userShopId = bag.message.author.id;
        }
        else{
            tagUser = bag.message.mentions.users.first();

            if(!tagUser){
                bag.message.channel.sendMessage(this.getUsage());

                return;
            }

            userShopId = tagUser.id;
        }

        const offers:Array<SocketActiveMarketOffer> = await bag.socket.marketGetPlayerOffers(userShopId);

        if(offers == null){
            bag.message.channel.sendMessage(`No offers found`);

            return;
        }

        let msg = bag.message.author.id == userShopId ? `Your` : tagUser.username+`'s`;
        
        msg += ` shop offers\n\n`;

        msg += offers.map(function(offer){
            const offerSid = MarketOfferEncoder.encode(offer.id);

            return `${offerSid} ${offer.price}GP each (${offer.amountLeft} left, ${offer.price*offer.amountLeft}GP buyout)`;
        }).join('\n');

        bag.message.channel.sendMessage(msg);
    }
}