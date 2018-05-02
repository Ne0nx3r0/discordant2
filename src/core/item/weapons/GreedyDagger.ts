import Weapon from '../Weapon';
import WeaponAttack, { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';

import Creature from '../../creature/Creature';

import ItemId from '../ItemId';
import EffectGoblinSneakPoison from '../../effects/types/EffectGoblinSneakPoison';
import { Attribute } from "../../creature/AttributeSet";
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';
import BattleTemporaryEffect from '../../effects/BattleTemporaryEffect';
import EffectId from '../../effects/EffectId';

export const GreedyDagger = new Weapon({
    id: ItemId.GreedyDagger,
    title: 'Greedy Dagger',
    description: `While it's not known if any ever succeeded in discovering the Exiled Magician's secret of immortality, these soul devouring blades are a testiment to all the attempts.`,
    damageBlocked: 0.01,
    useRequirements:{
        agility: 32,
    },
    criticalMultiplier: 2,
    chanceToCritical: 0.2,
    goldValue: 250,
    attacks: [
        new WeaponAttack({
            title: 'slash',
            minBaseDamage: 10,
            maxBaseDamage: 20,
            damageType: DamageType.dark,
            scalingAttribute: Attribute.vitality,
            scalingLevel: ScalingLevel.C,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} slashes {defender} with their greedy blade',
                    damageFunc: function(bag){
                        const baseDamages = DefaultDamageFunc(bag);

                        baseDamages[0].hpSteal = Math.ceil(baseDamages[0].amount * 0.1);

                        return baseDamages;
                    },
                }),
            ],
            aiUseWeight: 1.0
        }),
    ]
});