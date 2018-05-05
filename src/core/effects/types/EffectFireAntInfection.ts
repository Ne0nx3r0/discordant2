import BattleTemporaryEffect from "../BattleTemporaryEffect";
import EffectId from "../EffectId";

export const FIRE_ANT_INFECTION_STEPS = 6;

export const EffectFireAntInfection = new BattleTemporaryEffect({
    id: EffectId.FireAntInfectionStep,
    title: 'Fire Ant Infection Step',
    dispellable: true,
    onAddBonuses: function(stats,roundsLeft){
        stats.vitality -= FIRE_ANT_INFECTION_STEPS - roundsLeft;
    },
    onRoundBegin: function(bag){
        const roundsLeft = bag.target.tempEffects.get(EffectFireAntInfection);
        const vitMinus = FIRE_ANT_INFECTION_STEPS - roundsLeft;

        if(vitMinus == 0){
            bag.battle.queueBattleMessage([`${bag.target.title} is infected with a strange infection!`]);
        }
        else if(vitMinus != 1-FIRE_ANT_INFECTION_STEPS){
            bag.battle.queueBattleMessage([`${bag.target.title}'s infection worsens! (-${vitMinus} VIT)`]);
            bag.target.updateStats();
        }

    },
    onRemoved: function(bag){
        bag.battle.queueBattleMessage([`${bag.target.title} recovers from fire ant infection!`]);
    }
});
