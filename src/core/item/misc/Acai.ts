import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import ItemUsable from '../ItemUsable';
import PlayerCharacter from '../../creature/player/PlayerCharacter';

export const Acai = new ItemUsable({
    id: ItemId.Acai,
    title: 'Acai',
    goldValue: 4,
    description: '(Restores 20 HP) A wild berry whose nutritious nectars have healing properties.',
    battleExhaustion: 1,
    canUseInbattle: true,
    canUseInParty: true,
    canUse: function(user:PlayerCharacter,target:PlayerCharacter){
        if(target.hpCurrent >= target.stats.hpTotal){
            throw `${target.title}'s HP is already full`;
        }
    },
    onUse: function(user:PlayerCharacter,target:PlayerCharacter):string{
        const amountToHeal = Math.min( 20 , target.stats.hpTotal-target.hpCurrent );

        target.hpCurrent += amountToHeal;

        return `${target.title} healed ${amountToHeal}HP, now has ${target.hpCurrent}/${target.stats.hpTotal}HP`;
    }
});