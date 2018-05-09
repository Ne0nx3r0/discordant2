import Weapon from '../Weapon';
import WeaponAttack, { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import Creature from '../../creature/Creature';

import ItemId from '../ItemId';
import { DamageFuncBag, DamageType, IWeaponAttackDamages } from '../WeaponAttackStep';
import { Attribute } from "../../creature/AttributeSet";
import { DefaultDamageFunc } from "../../damage/DefaultDamageFunc";
import { EffectBless } from '../../effects/types/EffectBless';
import BattleTemporaryEffect from '../../effects/BattleTemporaryEffect';
import EffectId from '../../effects/EffectId';
import { EffectPrayer } from '../../effects/types/EffectPrayer';
import { GetScalingBonusFor } from '../../damage/DamageScaling';
import { EffectSanctuary } from '../../effects/types/EffectSanctuary';
import { EffectBarrier } from '../../effects/types/EffectBarrier';

export const TabletOfSanctuary = new Weapon({
    id: ItemId.TabletOfSanctuary,
    title: 'Tablet of Sanctuary',
    description: 'A stone tablet engraved with strange characters which those wanting for harmony in the world can use to protect themselves and those around them.',
    damageBlocked: 0.2,
    goldValue: 450,
    useRequirements:{
        spirit: 36
    },
    chanceToCritical: 0,
    attacks: [
        new WeaponAttack({
            title: 'sanctuary',
            minBaseDamage: 20,
            maxBaseDamage: 20,
            damageType: DamageType.special,
            isFriendly: true,
            chargesRequired: 3,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.No,
            specialDescription: `+20 resistance for the party for five turns`,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} reads a legend aloud and creates an aura of protection',
                    damageFunc: function(bag:DamageFuncBag){
                        bag.battle.participants.forEach(function(p){
                            if(p.teamNumber == bag.attacker.teamNumber && !p.defeated){
                                bag.battle.addTemporaryEffect(p.creature,EffectSanctuary,5);
                            }
                        });

                        return [];
                    }
                }),
            ],
            aiUseWeight: 1
        }),
        new WeaponAttack({
            title: 'barrier',
            minBaseDamage: 0,
            maxBaseDamage: 0,
            damageType: DamageType.special,
            isFriendly: true,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.No,
            chargesRequired: 2,
            specialDescription: 'A barrier protects the target from attacks for one round',
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} reads a legend of a great siege and creates a barrier around {defender}',
                    damageFunc: (e)=>{
                        e.battle.addTemporaryEffect(e.defender.creature,EffectBarrier,1);

                        return [];
                    }
                })
            ],
            aiUseWeight: 1
        }),
    ]
});