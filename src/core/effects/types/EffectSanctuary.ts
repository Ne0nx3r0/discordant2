import BattleTemporaryEffect from '../BattleTemporaryEffect';
import EffectId from '../EffectId';
import { Attribute } from '../../creature/AttributeSet';

export const EffectSanctuary = new BattleTemporaryEffect({
    id: EffectId.Sanctuary,
    title: 'Sanctuary',
    onAdded:(e)=>{
        e.battle.queueBattleMessage([`+${e.target.title} gains +20 to all resistances!`]);
    },
    onRemoved:(e)=>{
        e.battle.queueBattleMessage([`-${e.target.title}'s sanctuary wore off!`]);
    },
    onAddBonuses:function(stats){
        stats.resistances.physical += 20;
        stats.resistances.fire += 20;
        stats.resistances.thunder += 20;
        stats.resistances.dark += 20;
    }
});