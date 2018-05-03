import ItemEquippable, { OnDefendHandlerBag } from '../ItemEquippable';
import ItemId from '../ItemId';
import { EquipmentSlot } from '../CreatureEquipment';
import { ICreatureStatSet } from '../../creature/Creature';

export const WillOWispSkin = new ItemEquippable({
    id: ItemId.WillOWispSkin,
    title: 'Will-O-Wisp Skin',
    description: `A creature item`,
    goldValue: 1,
    slotType:'armor',
    onAddBonuses: function(stats:ICreatureStatSet){
        stats.resistances.dark -= 20;
        stats.resistances.thunder += 20;
    },
    onDefend: function(bag: OnDefendHandlerBag){
        if(Math.random() <= 0.3){
            bag.battle.queueBattleMessage([
                `${bag.defender.creature.title} blinked out of existence and the attack MISSED!`
            ]);
            return false;
        }
        return true;
    },
});