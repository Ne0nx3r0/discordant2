import ItemId from "../../item/ItemId";
import PlayerCharacter from "../../creature/player/PlayerCharacter";
import BattleTemporaryEffect from "../BattleTemporaryEffect";
import EffectId from "../EffectId";

export const EffectWillOWispDodge = new BattleTemporaryEffect({
    id: EffectId.WillOWispDodge,
    title: 'WillOWispDodge',
    onDefend: (e)=>{
        if(Math.random() <= 0.3){
            e.battle.queueBattleMessage([
                `${e.wad.target.creature.title} blinked out of existence and the attack MISSED!`
            ]);
            e.preventAttack();
        }
    },
});