import EffectId from "../EffectId";
import BattleTemporaryEffect from "../BattleTemporaryEffect";
import PlayerCharacter from "../../creature/player/PlayerCharacter";
import ItemId from "../../item/ItemId";
import { DamageType } from "../../item/WeaponAttackStep";

const SELF_DAMAGE_PER_ROUND = 10;

export const EffectTreantRage = new BattleTemporaryEffect({
    id: EffectId.TreantRage,
    title: 'Treant Rage',
    onAddBonuses: (e)=>{
        e.resistances.dark += 20;
        e.resistances.physical += 20;
        e.resistances.fire -= 10;
    },
    onRoundBegin: (e)=>{
        e.target.hpCurrent -= SELF_DAMAGE_PER_ROUND;

        e.battle.queueBattleMessage([
            `-${e.target.title} ${e.target.hpCurrent}/${e.target.stats.hpTotal} lost ${SELF_DAMAGE_PER_ROUND}HP from being on fire`            
        ]);
    },
    onAttack: (e)=>{
        e.wad.type = DamageType.fire;
        e.wad.amount = Math.round(e.wad.amount * 1.5);
    },
    onRemoved:(e)=>{
        e.battle.queueBattleMessage([
            `- ${e.target.title} is no longer on fire`
        ]);
    }
});