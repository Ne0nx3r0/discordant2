import BattleTemporaryEffect from '../BattleTemporaryEffect';
import EffectId from '../EffectId';
import { Attribute } from '../../creature/AttributeSet';

export const EffectShieldGrey = new BattleTemporaryEffect({
    id: EffectId.MagicShieldGrey,
    title: 'Grey Shield',
    dispellable: true,
    onAdded:(e)=>{
        e.battle.queueBattleMessage([`+${e.target.title} gains +100 physical resistance!`]);
    },
    onRemoved:(e)=>{
        e.battle.queueBattleMessage([`-${e.target.title}'s physical shield broke`]);
    },
    onAddBonuses:(stats)=>{
        stats.resistances.physical += 100;
    }
});