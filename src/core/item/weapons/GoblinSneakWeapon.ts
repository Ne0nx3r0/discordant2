import Weapon from '../Weapon';
import WeaponAttack, { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';
import Creature from '../../creature/Creature';

import ItemId from '../ItemId';
import EffectGoblinSneakPoison from '../../effects/types/EffectGoblinSneakPoison';
import { Attribute } from "../../creature/AttributeSet";
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';
import { DefeaultNoDamageFunc } from '../../damage/DefeaultNoDamageFunc';

export default new Weapon({
    id: ItemId.GoblinSneakPoisonWeapon,
    title: 'Goblin Sneak Poison Weapon',
    description: 'A creature item',
    damageBlocked: 0.05,
    useRequirements:{},
    goldValue:0,
    attacks: [
        new WeaponAttack({
            title: 'toxicspray',
            minBaseDamage: 0,
            maxBaseDamage: 0,
            damageType: DamageType.special,
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.C,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} takes in a deep breath',
                    damageFunc: DefeaultNoDamageFunc
                }),
                new WeaponAttackStep({
                    attackMessage: '{attacker} sprays the battlefield with a powerful toxin poisoning everyone!',
                    damageFunc: function(bag){
                        bag.battle.participants
                        .filter(function(p){
                            return p.teamNumber == 1;
                        })
                        .forEach(function(p){
                            bag.battle.addTemporaryEffect(p.creature,EffectGoblinSneakPoison,3);
                        });

                        return [];
                    }
                }),
            ],
            aiUseWeight: 0.5
        }),
        new WeaponAttack({
            title: 'dart',
            minBaseDamage: 8,
            maxBaseDamage: 12,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.C,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} shoots a dart at {defender}',
                    damageFunc: DefaultDamageFunc
                }),
            ],
            aiUseWeight: 0.5
        })
    ]
});