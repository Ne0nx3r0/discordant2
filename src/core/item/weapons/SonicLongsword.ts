import Weapon from '../Weapon';
import WeaponAttack, { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import Creature from '../../creature/Creature';
import DamageScaling from '../../damage/DamageScaling';
import ItemId from '../ItemId';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';
import { Attribute } from "../../creature/AttributeSet";

export default new Weapon({
    id: ItemId.SonicLongsword,
    title: 'Sonic Longsword',
    description: `A blade whose hilt generates an electric charge which is inflicted on enemies`,
    damageBlocked: 0.05,
    goldValue: 100,
    useRequirements:{
        Agility: 20
    },
    attacks: [
        new WeaponAttack({
            title: 'swing',
            minBaseDamage: 10,
            maxBaseDamage: 40,
            damageType: DamageType.THUNDER,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.B,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} slashes {defender} with a sonic blade',
                    damageFunc: DefaultDamageFunc
                })
            ],
            aiUseWeight: 0.8
        }),
    ]
});