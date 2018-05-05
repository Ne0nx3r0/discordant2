import ItemId from "../../item/ItemId";
import PlayerCharacter from "../../creature/player/PlayerCharacter";
import BattleTemporaryEffect from "../BattleTemporaryEffect";
import EffectId from "../EffectId";

export const EffectFairyBottle = new BattleTemporaryEffect({
    id: EffectId.BottleFairy,
    title: 'Fairy In a bottle',
    onDefeat: function(e){
        if(e.defender instanceof PlayerCharacter){
            const pc = e.defender;

            pc.hpCurrent = pc.stats.hpTotal;

            e.battle.queueBattleMessage([
                `+ 💓💓💓 ${pc.title}'s bottled fairy fully healed them and then flew away!`
            ]);
  
            e.battle.game.unequipPlayerItem(pc.uid,'pouch',true)
            .then(()=>{
                e.battle.game.takePlayerItem(pc.uid,ItemId.FairyInABottle,1);
            });
        }
    },
});