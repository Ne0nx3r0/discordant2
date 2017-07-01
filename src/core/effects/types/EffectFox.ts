import BattleTemporaryEffect from '../BattleTemporaryEffect';
import EffectId from '../EffectId';
import { Attribute } from '../../creature/AttributeSet';
import BattleTemporaryEffectAttributeBoost from '../BattleTemporaryEffectStatsBoost';

export const EffectFox = new BattleTemporaryEffectAttributeBoost({
    id: EffectId.Fox,
    title: `Fox`,
    attribute: Attribute.agility,
    amount: 10,
})