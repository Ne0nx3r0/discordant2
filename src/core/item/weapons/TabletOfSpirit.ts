import Weapon from '../Weapon';
import WeaponAttack, { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';

import Creature from '../../creature/Creature';

import ItemId from '../ItemId';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';
import { Attribute } from "../../creature/AttributeSet";
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';
import { EffectBless } from '../../effects/types/EffectBless';
import { GetScalingBonusFor } from '../../damage/DamageScaling';

const BOMB_MAX_DAMAGES = [
    18,//1 charge
    30,
    44,
    60,
    78,
    98,
    120,
    144,
    170,
    198,
    228,
    260,
    294,
    330,
    368,
    408,
    450,
    494,
    540,
    588,
    638,
    690,
    744,
    800,
    858,
    918,
    980,
    1044,
    1110,
    1178,
    1248,
    1320,
    1394,
    1470,
    1548,
    1628,
    1710,
    1794,
    1880,
    1968,//40 charges
];



export const TabletOfSpirit = new Weapon({
    id: ItemId.TabletOfSpirit,
    title: 'Tablet of Spirit',
    description: 'A stone tablet engraved with an ancient method of collecting ambient energy from around yourself.',
    damageBlocked: 0.05,
    goldValue: 150,
    useRequirements:{
        spirit: 40
    },
    chanceToCritical: 0.05,
    criticalMultiplier: 1.5,
    attacks: [
        new WeaponAttack({
            title: 'blast',
            minBaseDamage: 35,
            maxBaseDamage: 55,
            damageType: DamageType.thunder,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.B,
            chargesRequired: 2,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} channels their inner spirit and fires a ball of energy at {defender}',
                    damageFunc: DefaultDamageFunc
                })
            ],
            aiUseWeight: 0.8
        }),
        new WeaponAttack({
            title: 'bomb',
            minBaseDamage: 18,
            maxBaseDamage: 1968,
            specialDescription: 'Damage based on the number of charges (max 40)',
            damageType: DamageType.thunder,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.No,
            chargesRequired: 1,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} channels the energy of all living things around them into a storm at {defender}',
                    damageFunc: function(bag:DamageFuncBag){
                        const chargesUsed = bag.attacker.charges;
                        
                        //This one will be consumed by TurnBasedBattles
                        bag.attacker.charges = 1;

                        const maxDamage = BOMB_MAX_DAMAGES[chargesUsed];
                        const minDamage = maxDamage * 0.8;

                        const damageRoll = ( Math.random() * (maxDamage-minDamage) ) + minDamage;

                        const damageAmount = !bag.isCritical ? damageRoll : damageRoll * bag.step.attack.weapon.criticalMultiplier;

                        return [
                            {
                                target: bag.defender,
                                amount: Math.round(damageAmount),
                                type: DamageType.thunder,
                            }
                        ];
                    }
                })
            ],
            aiUseWeight: 0.8
        }),
    ]
});