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

export default new Weapon({
    id: ItemId.WerewolfWeapon,
    title: 'Werewolf Weapon',
    description: 'A creature item',
    damageBlocked: 0.05,
    chanceToCritical: 0.2,
    useRequirements:{},
    goldValue:0,
    onAddBonuses: (e)=>{
        e.target.stats.resistances.dark += 30;
        e.target.stats.resistances.thunder += 14;
        e.target.stats.resistances.physical += 20;
    },
    onBattleBegin: (e)=>{
        e.battle.addTemporaryEffect(e.target.creature,EffectRegeneration,-1);
    },
    attacks: [
        new WeaponAttack({
            title: 'slash',
            minBaseDamage: 30,
            maxBaseDamage: 50,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} slashes {defender} with huge claws',
                    damageFunc: DefaultDamageFunc
                }),
            ],
            aiUseWeight: 1
        }),
        new WeaponAttack({
            title: 'howl',
            minBaseDamage: 0,
            maxBaseDamage: 0,
            damageType: DamageType.special,
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} howls loudly sapping the courage of the party!',
                    damageFunc: (e)=>{
                        return [];
                    }
                }),
            ],
            aiUseWeight: 1
        }),

    ]
});