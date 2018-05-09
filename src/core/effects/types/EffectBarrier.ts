import BattleTemporaryEffect from '../BattleTemporaryEffect';
import EffectId from '../EffectId';
import { Attribute } from '../../creature/AttributeSet';

export const EffectBarrier = new BattleTemporaryEffect({
    id: EffectId.Barrier,
    title: 'Barrier',
    onAdded:(e)=>{
        e.battle.queueBattleMessage([`+A bright barrier surrounds ${e.target.title}!`]);
    },
    onRemoved:(e)=>{
        e.battle.queueBattleMessage([`-${e.target.title}'s barrier wore off!`]);
    },
    onDefend:(e)=>{
        e.preventAttack();

        e.battle.queueBattleMessage([
            `A bright barrier protects ${e.defender.title} from attack!`,
        ]);
    }
});