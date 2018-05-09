import ItemId from "../../item/ItemId";
import PlayerCharacter from "../../creature/player/PlayerCharacter";
import BattleTemporaryEffect from "../BattleTemporaryEffect";
import EffectId from "../EffectId";
import { GetDodgePercent } from "../../../util/GetDodgePercent";
import { Attribute } from "../../creature/AttributeSet";

export const EffectWillOWispDodge = new BattleTemporaryEffect({
    id: EffectId.WillOWispDodge,
    title: 'WillOWispDodge',
    onDefend: (e)=>{
        const scalingAttribute = Attribute[e.step.attack.scalingAttribute];
        const attackerAccuracy = e.attacker.stats[scalingAttribute];
        const chargesUsed = e.step.attack.chargesRequired;
        const defenderDodge = e.defender.stats.dodge;
        
        const dodgePercent = GetDodgePercent(attackerAccuracy,chargesUsed,defenderDodge);

        if(Math.random() <= dodgePercent){
            e.battle.queueBattleMessage([
                `${e.wad.target.creature.title} blinked out of existence and the attack MISSED!`
            ]);
            e.preventAttack();
        }
    },
});