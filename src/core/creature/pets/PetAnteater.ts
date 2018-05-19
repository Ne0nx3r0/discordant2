import Creature from '../Creature';
import CreatureId from '../CreatureId';
import CreatureEquipment from '../../item/CreatureEquipment';
import {BareHands, TabletOfFaith, TabletOfHealing} from '../../item/ItemsIndex';
import AttributeSet from '../AttributeSet';
import { PixieWeapon } from '../../item/weapons/PixieWeapon';
import { CreaturePet } from '../CreaturePet';
import PlayerCharacter from '../player/PlayerCharacter';

export default class PetAnteater extends CreaturePet{
    constructor(){
        super({
            id: CreatureId.PetAnteater,
            title: 'Anteater',
            description: 'A anteating beast',
            attributes: new AttributeSet({
                strength: 20,
                agility: 20,
                vitality: 12,
                spirit: 8,
                luck: 8,
            }),
            equipment: new CreatureEquipment({}),
            wishesDropped: 0,
        });
    }
}