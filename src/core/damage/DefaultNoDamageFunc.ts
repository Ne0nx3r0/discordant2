import { DamageFuncBag, IWeaponAttackDamages } from '../item/WeaponAttackStep';

export function DefaultNoDamageFunc(bag: DamageFuncBag): Array<IWeaponAttackDamages> {
    return [];
}