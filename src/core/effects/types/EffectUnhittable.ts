import ItemId from "../../item/ItemId";
import PlayerCharacter from "../../creature/player/PlayerCharacter";
import BattleTemporaryEffect from "../BattleTemporaryEffect";
import EffectId from "../EffectId";

export const EffectUnhittable = new BattleTemporaryEffect({
    id: EffectId.Unhittable,
    title: 'Effect Unhittable',
    onDefend: function(e){
        e.preventAttack();
        e.battle.queueBattleMessage([
            `${e.attacker.title}'s attack missed!`
        ]);
    }
});