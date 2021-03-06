import CreatureId from '../CreatureId';
import CreatureAIControlled from '../CreatureAIControlled';
import AttributeSet from '../AttributeSet';
import CreatureEquipment from '../../item/CreatureEquipment';
import { FireAntMiteWeapon } from '../../item/weapons/FireAntMiteWeapon';
import { FireAntInfectedWeapon } from "../../item/weapons/FireAntInfectedWeapon";

export default class FireAntInfected extends CreatureAIControlled{
    constructor(){
        super({
            id: CreatureId.FireAntInfected,
            title: 'Infected Giant Fire Ant',
            description: 'The result of a strange infection seems to have caused this ant to wander from the nest.',
            allowRun: false,
            attributes: new AttributeSet({
                strength: 24,
                agility: 40,
                vitality: 30,
                spirit: 0,
                luck: 0,
            }),
            equipment: new CreatureEquipment({
                weapon: FireAntInfectedWeapon
            }),
            wishesDropped: 250,
        });
    }
}