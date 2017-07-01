import BattleTemporaryEffect from '../BattleTemporaryEffect';
import EffectId from '../EffectId';
import { Attribute } from '../../creature/AttributeSet';
import BattleTemporaryEffectAttributeBoost from '../BattleTemporaryEffectStatsBoost';

export const EffectSage = new BattleTemporaryEffectAttributeBoost({
    id: EffectId.Sage,
    title: `Sage`,
    attribute: Attribute.spirit,
    amount: 10,
})