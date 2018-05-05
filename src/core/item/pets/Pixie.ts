import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';
import { IBattleCreature } from '../../battle/CreatureBattleTurnBased';
import PlayerCharacter from '../../creature/player/PlayerCharacter';
import BattleTemporaryEffect from '../../effects/BattleTemporaryEffect';
import EffectId from '../../effects/EffectId';
import PixieCreature from '../../creature/pets/Pixie';

export const PixieItem = new ItemEquippable({
    id: ItemId.Pixie,
    title: 'Pixie',
    description: `(when worn summons a helpful pixie during battle) Prototype item.`,
    goldValue: 1250,
    showInItems: true,
    slotType:'pouch',
    onBattleBegin:(e)=>{
        const bpc = e.battle.getBattleCreatureForAction(e.target);

        e.battle.addParticipant(new PixieCreature(),bpc.teamNumber);
    }
});