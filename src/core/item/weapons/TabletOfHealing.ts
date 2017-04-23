import Weapon from '../Weapon';
import WeaponAttack, { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import IDamageSet from '../../damage/IDamageSet';
import Creature from '../../creature/Creature';
import DamageScaling from '../../damage/DamageScaling';
import ItemId from '../ItemId';
import { DamageFuncBag } from '../WeaponAttackStep';
import { Attribute } from "../../creature/AttributeSet";

export default new Weapon({
    id: ItemId.TabletOfHealing,
    title: 'Tablet of Healing',
    description: 'A stone tablet engraved with strange characters which read aloud can heal the reader.',
    damageBlocked: 0.05,
    useRequirements:{
        Spirit: 16
    },
    attacks: [
        new WeaponAttack({
            title: 'heal',
            minBaseDamage: 40,
            maxBaseDamage: 60,
            damageType: 'special',
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.B,
            exhaustion: 1,
            chargesRequired: 2,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} reads a legend outloud and heals',
                    damageFunc: function(bag:DamageFuncBag){
                        bag.attacker.hpCurrent = Math.min(bag.attacker.stats.hpTotal,bag.attacker.hpCurrent+30);

                        return {};
                    }
                })
            ],
            aiUseWeight: 0.8
        }),
        new WeaponAttack({
            title: 'bless',
            minBaseDamage: 5,
            maxBaseDamage: 10,
            damageType: 'special',
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.B,
            exhaustion: 1,
            chargesRequired: 3,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} reads a legend aloud blessing {defender}',
                    damageFunc: function(bag:DamageFuncBag){

                        return {};
                    }
                }),
            ],
            aiUseWeight: 0.2
        }),
    ]
});