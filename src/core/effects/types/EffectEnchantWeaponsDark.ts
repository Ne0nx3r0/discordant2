import BattleTemporaryEffect from '../BattleTemporaryEffect';
import EffectId from '../EffectId';
import { Attribute } from '../../creature/AttributeSet';
import { DamageType } from '../../item/WeaponAttackStep';

export const EffectEnchantWeaponsDark = new BattleTemporaryEffect({
    id: EffectId.EnchantWeaponsDark,
    title: 'Enchant Weapons Dark',
    onAttack:(e)=>{
        e.wad.type = DamageType.dark;
    },
    onAdded:(e)=>{
        e.battle.queueBattleMessage([
            `A dark enchantment enhances ${e.target.title}'s weapons`
        ]);
    },
    onRemoved:(e)=>{
        e.battle.queueBattleMessage([`-${e.target.title}'s dark weapon enchantment wore off`]);
    },
});