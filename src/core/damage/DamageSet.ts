interface IDamageSet{
    physical?:number;
    fire?:number;
    acid?:number;
    thunder?:number;
    chaos?:number;//resistance = lowest of the four other resistances
}

export default class DamageSet{
    damages:IDamageSet;
    message:string;

    constructor(message:string,damages:IDamageSet){
        this.message = message;
        this.damages = damages;
    }

    total():number{
        let total = 0;
        
        Object.keys(this.damages).forEach(function(type){
            total += this.damages[type];
        });

        return Math.round(total);
    }
};