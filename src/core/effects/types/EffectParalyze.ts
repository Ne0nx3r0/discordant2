import BattleTemporaryEffect from '../BattleTemporaryEffect';
import EffectId from '../EffectId';
import { Attribute } from '../../creature/AttributeSet';

export const EffectParalyze = new BattleTemporaryEffect({
    id: EffectId.Paralyze,
    title: 'Paralyzed',
    onAdded:function(effectBag){
        effectBag.sendBattleEmbed([`-${effectBag.target.title} is paralyzed and cannot attack`]);
    },
    onRemoved:function(effectBag){
        effectBag.sendBattleEmbed([`+${effectBag.target.title} is no longer paralyzed`]);
    },
    onRoundBegin:function(effectBag){
        effectBag.battle.getBattleCreatureForAction(effectBag.target).exhausted = true;
    }
});