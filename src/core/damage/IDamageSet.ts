interface IDamageSet{
    Physical?:number;
    Fire?:number;
    Cold?:number;
    Thunder?:number;
    Chaos?:number;//resistance = lowest of the four other resistances
}

export default IDamageSet;

export {damagesTotal};

function damagesTotal(damages:IDamageSet):number{
    let total = 0;
    
    Object.keys(damages).forEach(function(type){
        total += damages[type];
    });

    return total;
}