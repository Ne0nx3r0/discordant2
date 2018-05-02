import ItemEquippable, { OnDefeatHandlerBag } from '../ItemEquippable';
import ItemId from '../ItemId';
import { EquipmentSlot } from '../CreatureEquipment';
import { ICreatureStatSet } from '../../creature/Creature';
import { IBattleCreature } from '../../battle/CreatureBattleTurnBased';
import PlayerCharacter from '../../creature/player/PlayerCharacter';

export const FairyInABottle = new ItemEquippable({
    id: ItemId.FairyInABottle,
    title: 'Fairy in a Bottle',
    description: `(restores HP on defeat and is then consumed) Though the destruction of the great wish corrupted many things, the bits of hope created a race of small altruistic creatures with healing powers. Those who've managed to catch one find themselves with a valuable ally who will help them in their time of need.`,
    goldValue: 1000,
    showInItems: true,
    slotType:'pouch',
    onDefeat: function(bag: OnDefeatHandlerBag){
        if(bag.wearer.creature instanceof PlayerCharacter){
            const pc = bag.wearer.creature;

            pc.hpCurrent = pc.stats.hpTotal;

            bag.battle.queueBattleMessage([
                `+ 💓💓💓 ${pc.title}'s bottled fairy fully healed them and then flew away!`
            ]);
  
            bag.battle.game.unequipPlayerItem(pc.uid,'pouch',true)
            .then(()=>{
                this.game.takePlayerItem(pc.uid,ItemId.FairyInABottle,1);
            });

        }
    },
});