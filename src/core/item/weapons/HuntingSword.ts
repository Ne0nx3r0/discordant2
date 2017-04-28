import Weapon from '../Weapon';
import WeaponAttack, { WeaponDamageType, ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import IDamageSet from '../../damage/IDamageSet';
import Creature from '../../creature/Creature';
import DamageScaling from '../../damage/DamageScaling';
import ItemId from '../ItemId';
import { DamageFuncBag } from '../WeaponAttackStep';
import { Attribute } from "../../creature/AttributeSet";
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';

export default new Weapon({
    id: ItemId.HuntingSword,
    title: 'Hunting Sword',
    description: 'A straight, pointed blade used to quickly and silently finish off prey before its calls can alert other, larger predators to the meal.',
    damageBlocked: 0.05,
    goldValue: 30,
    useRequirements: {
        Strength: 12
    },//no use requirements
    attacks: [
        new WeaponAttack({
            title: 'swing',
            minBaseDamage: 8,
            maxBaseDamage: 14,
            damageType: 'physical',
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.C,
            exhaustion: 1,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} slices {defender} with their hunting sword',
                    damageFunc: DefaultDamageFunc
                })
            ],
            aiUseWeight: 0.6
        }),
        new WeaponAttack({
            title: 'duo',
            minBaseDamage: 8,
            maxBaseDamage: 12,
            damageType: 'physical',
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.C,
            exhaustion: 2,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} jumps behind and slashes {defender} with their hunting sword',
                    damageFunc: DefaultDamageFunc
                }),
                new WeaponAttackStep({
                    attackMessage: '{attacker} follows up with a stab to {defender}',
                    damageFunc: function(bag:DamageFuncBag){
                        const damages = DefaultDamageFunc(bag);

                        damages[bag.step.attack.damageType] *= 2; 

                        return damages;
                    }
                })
            ],
            aiUseWeight: 0.4
        }),
    ]
});