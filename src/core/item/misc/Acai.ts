import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import ItemUsable from '../ItemUsable';
import PlayerCharacter from '../../creature/player/PlayerCharacter';

export default new ItemUsable({
    id: ItemId.Acai,
    title: 'Acai',
    goldValue: 10,
    description: '(Restores 20 HP) A wild berry whose nutritious nectars have healing properties.',
    battleExhaustion: 1,
    canUse: function(user:PlayerCharacter){
        if(user.hpCurrent >= user.stats.hpTotal){
            throw `${user.title}'s HP is already full`;
        }
    },
    onUse: function(user:PlayerCharacter):string{
        const amountToHeal = Math.min( 20 , user.stats.hpTotal-user.hpCurrent );

        user.hpCurrent += amountToHeal;

        return `${user.title} healed ${amountToHeal}HP, now has ${user.hpCurrent}/${user.stats.hpTotal}HP`;
    }
});