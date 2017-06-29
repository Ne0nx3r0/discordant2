import CreatureAIControlled from '../CreatureAIControlled';
import CreatureId from '../CreatureId';
import AttributeSet from '../AttributeSet';
import CreatureEquipment from '../../item/CreatureEquipment';
import Weapon from '../../item/Weapon';
import ItemId from '../../item/ItemId';
import WeaponAttack from '../../item/WeaponAttack';
import { DamageType } from '../../item/WeaponAttackStep';
import { ScalingLevel } from '../../item/WeaponAttack';
import { Attribute } from '../AttributeSet';
import WeaponAttackStep from '../../item/WeaponAttackStep';
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';
import BattleTemporaryEffect from '../../effects/BattleTemporaryEffect';
import EffectId from '../../effects/EffectId';
import { ExiledMagicianWeapon } from '../../item/weapons/ExiledMagicianWeapon';
import { ExiledMagicianRobes } from '../../item/clothing/ExiledMagicianRobes';

export default class ExiledMagician extends CreatureAIControlled{
    constructor(){
        super({
            id: CreatureId.ExiledMagician,
            title: 'The Exiled Magician',
            description: 'One of the seven magicians responsible for the creation of corrupted wishes. After several attempts to end his life failed he was locked away deep within the red forest in a castle guarded by the undead.',
            allowRun: false,
            attributes: new AttributeSet({
                strength: 10,
                agility: 10,
                vitality: 50,
                spirit: 0,
                luck: 0,
            }),
            equipment: new CreatureEquipment({
                weapon: new ExiledMagicianWeapon(),
                armor: ExiledMagicianRobes,
            }),
            wishesDropped: 500,
            onDefeated: function(bag){
                bag.party.sendChannelMessage(`As his body turns to vapor you catch a smile on the magician's face and hear a faint whisper just behind your ear...\n\n"Thank you..."`);
            }
        });
    }
}