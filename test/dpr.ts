import AllItems from '../src/core/item/AllItems';
import Weapon from '../src/core/item/Weapon';
import CalculateDamagePerRound from '../src/util/CalculateDamagePerRound';

const items = new AllItems();

items.items.forEach(function(item){
    if(item instanceof Weapon){
        const weapon = item;

        item.attacks.forEach(function(attack){
            const dpr = CalculateDamagePerRound(attack);

            let statsRequired  = 0; 

            try{
                statsRequired = Object
                .keys(weapon.useRequirements)
                .map(function(key){
                    return weapon.useRequirements[key];
                })
                .reduce(function(a,b){
                    return a + b;
                });
            }
            catch(ex){}

            console.log(`${weapon.title},${attack.title},${dpr},${statsRequired}`);
        });
    }    
});