const Hashids = require('hashids');

const hashids = new Hashids(
    "Discordant", 
    6, 
    "abcdefghijklmnopqrstuvwxyz1234567890"    
);

const MarketOfferEncoder= {
    decode: function(sid:string):number{
        const id = hashids.decode(sid)[0];

        if(!id){
            throw 'Invalid offer id "'+sid+'"';
        }
        
        return id;
    },
    encode: function (nid: number):string{
        return hashids.encode(nid);
    }
}

export default MarketOfferEncoder;