const Hashids = require('hashids');

const hashids = new Hashids(
    "Discordant", 
    6, 
    "abcdefghijklmnopqrstuvwxyz1234567890"    
);

const MarketOfferEncoder= {
    decode: function(sid:string):number{
        return hashids.decode(sid);
    },
    encode: function (nid: number):string{
        return hashids.encode(nid);
    }
}

export default MarketOfferEncoder;