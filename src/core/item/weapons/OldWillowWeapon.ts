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
import { EffectRegeneration } from '../../effects/types/EffectRegeneration';
import { EffectUnhittable } from '../../effects/types/EffectUnhittable';
import { EffectToxicSporePoison } from '../../effects/types/EffectToxicSporePoison';
import { EffectTreantRageTrigger } from '../../effects/types/EffectTreantRageTrigger';

export default new Weapon({
    id: ItemId.OldWillowWeapon,
    title: 'Old Willow Weapon',
    description: 'A creature item',
    damageBlocked: 0.05,
    chanceToCritical: 0.1,
    useRequirements:{},
    goldValue: 0,
    onAddBonuses: (e)=>{
        e.target.stats.resistances.dark += 40;
        e.target.stats.resistances.thunder += 20;
        e.target.stats.resistances.physical += 20;
        e.target.stats.resistances.fire -= 10;
    },
    onBattleBegin: (e)=>{
        e.battle.addTemporaryEffect(e.target.creature,EffectTreantRageTrigger,-1);
    },
    attacks: [
        new WeaponAttack({
            title: 'whip',
            minBaseDamage: 10,
            maxBaseDamage: 30,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} whips a branch at {defender}',
                    damageFunc: DefaultDamageFunc
                }),
            ],
            aiUseWeight: 3
        }),
        new WeaponAttack({
            title: 'poison',
            minBaseDamage: 0,
            maxBaseDamage: 0,
            damageType: DamageType.special,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: `{attacker} shakes its branches sending toxic spores everywhere`,
                    damageFunc: DefaultNoDamageFunc,
                }),
                new WeaponAttackStep({
                    attackMessage: `Toxic spores begin to take hold!`,
                    damageFunc: (e)=>{    
                        e.battle.participants.forEach(function(p){
                            if(e.attacker.teamNumber !== p.teamNumber){
                                e.battle.addTemporaryEffect(p.creature,EffectToxicSporePoison,6);
                            }
                        });

                        return [];
                    }
                }),
            ],
            aiUseWeight: 1
        }),
    ]
});