import BattleTemporaryEffect from '../BattleTemporaryEffect';
import EffectId from '../EffectId';
import { Attribute } from '../../creature/AttributeSet';
import BattleTemporaryEffectAttributeBoost from '../BattleTemporaryEffectStatsBoost';

export const EffectBane = new BattleTemporaryEffectAttributeBoost({
    id: EffectId.WolfsBane,
    title: `Wolf's Bane`,
    attribute: Attribute.strength,
    amount: 10,
})