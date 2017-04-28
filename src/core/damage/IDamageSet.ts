interface IDamageSet{
    physical?:number;
    fire?:number;
    acid?:number;
    thunder?:number;
    chaos?:number;//resistance = lowest of the four other resistances
}

export default IDamageSet;

export function DamagesTotal(damages:IDamageSet):number{
    let total = 0;
    
    Object.keys(damages).forEach(function(type){
        total += damages[type];
    });

    return Math.round(total);
}