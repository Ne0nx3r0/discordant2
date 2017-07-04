import BattleTemporaryEffect from '../BattleTemporaryEffect';
import EffectId from '../EffectId';
import { Attribute } from '../../creature/AttributeSet';
import BattleTemporaryEffectAttributeBoost from '../BattleTemporaryEffectStatsBoost';

export const EffectRush = new BattleTemporaryEffectAttributeBoost({
    id: EffectId.Rush,
    title: `Rush`,
    attribute: Attribute.agility,
    amount: 10,
})