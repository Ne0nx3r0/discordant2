import CharacterClass from './CharacterClass';
import AttributeSet from '../AttributeSet';
import CreatureEquipment from '../../item/CreatureEquipment';
import {WornLeathers} from '../../item/clothing/WornLeathers';
import {TabletOfHealing} from '../../item/weapons/TabletOfHealing';
import Collection from '../../../util/Collection';
import { WoodShield } from "../../item/weapons/WoodShield";
import { HuntingSword } from '../../item/weapons/HuntingSword';
import { Dagger } from '../../item/weapons/Dagger';
import { ClothHood } from '../../item/clothing/ClothHood';
import { ClothTunic } from '../../item/clothing/ClothTunic';
import { TabletOfThunder } from '../../item/weapons/TabletOfThunder';
import { Kukri } from '../../item/weapons/Kukri';
import { Mace } from '../../item/weapons/Mace';

enum CharacterClassId{
    Nobody,
    Mercenary,
    Healer,
    Magician,
    Rogue,
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
    'Your path has always been your own, but for the cost of receiving no help along the way.',
    new AttributeSet({
        strength: 8,
        agility: 8,
        vitality: 8,
        spirit: 8,
        luck: 8,
    })
));

addClass(new CharacterClass(
    CharacterClassId.Mercenary,
    'Mercenary',
    'Having lived a life of service you\'re ready to carve out a piece for yourself.',
    new AttributeSet({
        strength: 16,
        agility: 8,
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
        spirit: 16,
        luck: 10,
    }),
    new CreatureEquipment({
        weapon: Mace,
        offhand: TabletOfHealing,
    }),
));

addClass(new CharacterClass(
    CharacterClassId.Magician,
    'Magician',
    'One of the countless entertainers now forced to use their mastery of wish magic to survive.',
    new AttributeSet({
        strength: 10,
        agility: 6,
        vitality: 8,
        spirit: 16,
        luck: 10,
    }),
    new CreatureEquipment({
        hat: ClothHood,
        armor: ClothTunic,
        weapon: TabletOfThunder,
    }),
));

addClass(new CharacterClass(
    CharacterClassId.Magician,
    'Magician',
    'One of the countless entertainers now forced to use their mastery of wish magic to survive.',
    new AttributeSet({
        strength: 10,
        agility: 6,
        vitality: 8,
        spirit: 16,
        luck: 10,
    }),
    new CreatureEquipment({
        hat: ClothHood,
        armor: ClothTunic,
        weapon: TabletOfThunder,
    }),
));

addClass(new CharacterClass(
    CharacterClassId.Rogue,
    'Rogue',
    'As the world gave way to chaos and great beasts took back the wild, thieves, hunters and skilled treasure seekers such as yourself found a new world of opportunities to use their unique skills',
    new AttributeSet({
        strength: 6,
        agility: 14,
        vitality: 10,
        spirit: 8,
        luck: 12,
    }),
    new CreatureEquipment({
        hat: ClothHood,
        armor: ClothTunic,
        weapon: Dagger,
    }),
));

