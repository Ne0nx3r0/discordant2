import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';
import { IBattleCreature } from '../../battle/CreatureBattleTurnBased';
import PlayerCharacter from '../../creature/player/PlayerCharacter';
import BattleTemporaryEffect from '../../effects/BattleTemporaryEffect';
import EffectId from '../../effects/EffectId';
import { EffectFairyBottle } from '../../effects/types/EffectFairyBottle';

export const FairyInABottle = new ItemEquippable({
    id: ItemId.FairyInABottle,
    title: 'Fairy in a Bottle',
    description: `(restores HP on defeat and is then consumed) Though the destruction of the great wish corrupted many things, the bits of hope created a race of small altruistic creatures with healing powers. Those who've managed to catch one find themselves with a valuable ally who will help them in their time of need.`,
    goldValue: 1000,
    showInItems: true,
    slotType:'pouch',
    onBattleBegin:(e)=>{
        e.battle.addTemporaryEffect(e.target.creature,EffectFairyBottle,-1);
    }
});