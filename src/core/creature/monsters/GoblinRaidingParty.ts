import Creature from '../Creature';
import CreatureId from '../CreatureId';
import CreatureEquipment from '../../item/CreatureEquipment';
import {BareHands} from '../../item/ItemsIndex';
import AttributeSet from '../AttributeSet';
import CreatureAIControlled from '../CreatureAIControlled';
import GoblinRaidingPartyWeapon from '../../item/weapons/GoblinRaidingPartyWeapon';

export default class GoblinRaidingParty extends CreatureAIControlled{
    constructor(){
        super({
            id: CreatureId.GoblinRaidingParty,
            title: 'Goblin Raiding Party',
            description: 'A roaming party of goblins looking for careless adventurer\'s to rob... or worse.',
            attributes: new AttributeSet({
                strength: 18,
                agility: 10,
                vitality: 10,
                spirit: 0,
                luck: 0,
            }),
            equipment: new CreatureEquipment({
                weapon: GoblinRaidingPartyWeapon
            }),
            wishesDropped: 40,
        });
    }
}