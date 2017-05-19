import CharacterClass from './CharacterClass';
import AttributeSet from '../AttributeSet';
import CreatureEquipment from '../../item/CreatureEquipment';
import {WornLeathers} from '../../item/clothing/WornLeathers';
import {TabletOfHealing} from '../../item/weapons/TabletOfHealing';
import Collection from '../../../util/Collection';
import { WoodShield } from "../../item/weapons/WoodShield";
import { HuntingSword } from '../../item/weapons/HuntingSword';
import { Dagger } from '../../item/weapons/Dagger';

enum CharacterClassId{
    Nobody,
    Mercenary,
    Healer
}

export {CharacterClassId};

const classes = new Collection();

export default classes;

function addClass(c){
    classes.set(c.id,c);
}

addClass(new CharacterClass(
    CharacterClassId.Nobody,
    'Nobody',
    'Your path is your own, but you will receive no help along the way.',
    new AttributeSet({
        strength: 10,
        agility: 10,
        vitality: 10,
        spirit: 10,
        luck: 10,
    })
));

addClass(new CharacterClass(
    CharacterClassId.Mercenary,
    'Mercenary',
    'Having lived a life of service you\'re ready to carve out a piece for yourself.',
    new AttributeSet({
        strength: 12,
        agility: 12,
        vitality: 14,
        spirit: 4,
        luck: 8,
    }),
    new CreatureEquipment({
        armor: WornLeathers,
        weapon: HuntingSword,
        offhand: WoodShield,
    }),
));

addClass(new CharacterClass(
    CharacterClassId.Healer,
    'Healer',
    'A practiced reader of legends who focuses on the healing arts.',
    new AttributeSet({
        strength: 6,
        agility: 6,
        vitality: 12,
        spirit: 18,
        luck: 8,
    }),
    new CreatureEquipment({
        weapon: Dagger,
        offhand: TabletOfHealing,
    }),
));