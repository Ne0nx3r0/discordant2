import { CalculateScalingBonus, SCALING_LEVEL_MODIFIERS } from '../src/core/damage/DamageScaling';
import { ScalingLevel } from '../src/core/item/WeaponAttack';
const Table = require('cli-table');

const damage = Number(process.argv[process.argv.length - 1]);

const ATTRIBUTE_BONUSES:Array<number> = [
    0,
    1,
    5,
    10,
    20,
    30,
    40,
    50,
    60,
    70,
    80,
    90,
    100,
];

const table = new Table();

table.push(
    (['Stat bonus ->'] as Array<any>)
    .concat(ATTRIBUTE_BONUSES)
);

for(var item in ScalingLevel){
    //only iterate the non-numeric values
    if(ScalingLevel.hasOwnProperty(item) && !/^\d+$/.test(item)){
                                                             // GG typescript
        const scalingLevel:ScalingLevel = ScalingLevel[item] as any as ScalingLevel;

        table.push(
            ([ScalingLevel[scalingLevel]] as Array<any>)
            .concat(
                ATTRIBUTE_BONUSES.map(function(attribute){
                    return Math.round(damage * CalculateScalingBonus(attribute,scalingLevel));
                })
            )
        );
    }
}

console.log(table.toString());