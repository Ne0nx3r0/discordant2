import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import ItemUsable from '../ItemUsable';
import PlayerCharacter from '../../creature/player/PlayerCharacter';

export const Tent = new ItemUsable({
    id: ItemId.Tent,
    title: 'Tent',
    description: '(Heals 100 HP for all party members) A small bag of camping equipment which can be deployed to allow a party to safely rest for a time.',
    goldValue: 40,
    buyCost: 80,
    canUseInbattle: false,
    canUseInParty: true,
    onUse: function(user:PlayerCharacter,target:PlayerCharacter):string{
        if(!user.party){
            const amountHealed = Math.min(100,user.stats.hpTotal-user.hpCurrent);

            user.hpCurrent += amountHealed;

            return `You set up a small camp site and rested healing ${amountHealed}HP (now at ${user.hpCurrent}/${user.stats.hpTotal})`;
        }
        else{
            const amountsHealed = [];
            
            user.party.members.forEach(function(member){
                const amountHealed = Math.min(100,member.stats.hpTotal-member.hpCurrent);
            
                member.hpCurrent += amountHealed;

                amountsHealed.push(`${member.title} healed ${amountHealed}HP (now at ${member.hpCurrent}/${member.stats.hpTotal})`);
            });
            
            const amountsHealedStr = amountsHealed.join('\n');

            return `${user.title} set up a small camp site allowing the party to rest\n\n${amountsHealedStr}`;
        }
    }
});