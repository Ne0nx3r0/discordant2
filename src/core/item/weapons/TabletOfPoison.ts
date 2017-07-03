import Weapon from '../Weapon';
import WeaponAttack, { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';
import Creature from '../../creature/Creature';

import ItemId from '../ItemId';
import EffectSpiritSnakePoison from '../../effects/types/EffectSpiritSnakePoison';
import { Attribute } from "../../creature/AttributeSet";

export const TabletOfPoison =  new Weapon({
    id: ItemId.TableOfPoison,
    title: 'Tablet of Poison',
    description: 'A stone tablet engraved with strange characters which read aloud can poison enemies',
    damageBlocked: 0.05,
    goldValue: 100,
    useRequirements:{
        spirit: 18
    },
    attacks: [
        new WeaponAttack({
            title: 'poison',
            minBaseDamage: 8,
            maxBaseDamage: 12,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.C,
            chargesRequired: 2,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} reads a legend aloud and poisons {defender}',
                    damageFunc: function(bag:DamageFuncBag){
                        bag.battle.addTemporaryEffect(bag.defender.creature,EffectSpiritSnakePoison,5);

                        return [];
                    }
                })
            ],
            aiUseWeight: 1.0
        })
    ]
});