import Weapon from '../Weapon';
import WeaponAttack from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';

import Creature from '../../creature/Creature';

import ItemId from '../ItemId';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';
import { Attribute } from '../../creature/AttributeSet';
import { ScalingLevel, WeaponDamageType } from '../WeaponAttack';
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';
import { ICreatureStatSet } from '../../creature/Creature';

//TODO: Add passive resistances to shields
export const FireAntShield = new Weapon({
    id: ItemId.FireAntShield,
    title: 'Fire Ant Shield',
    description: '(+4 all resistances) A shield fashioned from the shells of many giant fire ants.\n\nThere was a time when travelers claimed the lake in the Red Forest is haunted, but since the great collapse few ever make the journey to the forest at all, let alone with time to explore the lake.',
    damageBlocked: 0.30,
    goldValue: 150,
    useRequirements: {
        strength: 24
    },
    onAddBonuses: function(stats:ICreatureStatSet){
        stats.resistances.physical += 4;
        stats.resistances.fire += 4;
        stats.resistances.thunder += 4;
        stats.resistances.dark += 4;
    },
    recipe: {
        wishes: 150,
        components:[
            {
                itemId: ItemId.FireAntCarapace,
                amount: 30,
            },
        ],
    },
    attacks: [
        new WeaponAttack({
            title: 'shove',
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.B,
            minBaseDamage: 5,
            maxBaseDamage: 10,
            damageType: DamageType.fire,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} shoves {defender} with their shield',
                    damageFunc: DefaultDamageFunc,
                })
            ],
            aiUseWeight: 0.8
        }),
    ]
});