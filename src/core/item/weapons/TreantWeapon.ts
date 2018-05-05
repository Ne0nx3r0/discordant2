import Weapon from '../Weapon';
import WeaponAttack, { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep, { IWeaponAttackDamages } from '../WeaponAttackStep';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';
import Creature, { ICreatureStatSet } from '../../creature/Creature';

import ItemId from '../ItemId';
import EffectGoblinSneakPoison from '../../effects/types/EffectGoblinSneakPoison';
import { Attribute } from "../../creature/AttributeSet";
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';
import { DefaultNoDamageFunc } from '../../damage/DefaultNoDamageFunc';
import { DefaultDamageAllFunc } from '../../damage/DefaultDamageAllFunc';
import { EffectTreantRage } from '../../effects/types/EffectTreantRage';
import { EffectTreantRageTrigger } from '../../effects/types/EffectTreantRageTrigger';

export default new Weapon({
    id: ItemId.TreantWeapon,
    title: 'Treant Weapon',
    description: 'A creature item',
    damageBlocked: 0.05,
    chanceToCritical: 0.2,
    useRequirements:{},
    goldValue:0,
    onAddBonuses: (e)=>{
        e.stats.resistances.dark += 20;
        e.stats.resistances.thunder += 20;
        e.stats.resistances.physical += 20;
        e.stats.resistances.fire -= 20;
    },
    onBattleBegin: (e)=>{
        e.battle.addTemporaryEffect(e.target,EffectTreantRageTrigger,-1);
    },
    attacks: [
        new WeaponAttack({
            title: 'swipe',
            minBaseDamage: 20,
            maxBaseDamage: 40,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} swipes at {defender} with its branches',
                    damageFunc: DefaultDamageFunc
                }),
            ],
            aiUseWeight: 0.5
        }),
        new WeaponAttack({
            title: 'animate',
            minBaseDamage: 30,
            maxBaseDamage: 50,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: `{attacker} causes nearby trees to assault the party!`,
                    damageFunc: DefaultDamageAllFunc,
                }),
            ],
            aiUseWeight: 0.5
        }),
    ]
});