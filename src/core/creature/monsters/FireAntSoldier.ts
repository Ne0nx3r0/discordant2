import CreatureId from '../CreatureId';
import CreatureAIControlled from '../CreatureAIControlled';
import AttributeSet from '../AttributeSet';
import CreatureEquipment from '../../item/CreatureEquipment';
import { FireAntMiteWeapon } from '../../item/weapons/FireAntMiteWeapon';
import { FireAntSoldierWeapon } from '../../item/weapons/FireAntSoldierWeapon';
import ItemId from '../../item/ItemId';

export default class FireAntSoldier extends CreatureAIControlled{
    constructor(){
        super({
            id: CreatureId.FireAntSoldier,
            title: 'Giant Fire Ant Soldier',
            description: 'A common parasite that lives off of giant fire ants',
            attributes: new AttributeSet({
                strength: 20,
                agility: 20,
                vitality: 20,
                spirit: 0,
                luck: 0,
            }),
            equipment: new CreatureEquipment({
                weapon: FireAntSoldierWeapon
            }),
            wishesDropped: 60,
            onDefeated: function(bag){
                let droppedCarapacesMsgs = [];

                bag.party.members.forEach(function(member){
                    const roll = Math.random() - Math.min(0.2,member.stats.magicFind/100);

                    if(roll < 0.1){
                        droppedCarapacesMsgs.push(`${member.title} found 2 fire ant carapaces`);
                        
                        bag.party.game.grantPlayerItem(member.uid,ItemId.FireAntCarapace,2);
                    }
                    else if(roll < 0.3){
                        droppedCarapacesMsgs.push(`${member.title} found a fire ant carapace`);
                        
                        bag.party.game.grantPlayerItem(member.uid,ItemId.FireAntCarapace,1);
                    }
                });

                if(droppedCarapacesMsgs.length > 0){
                    bag.party.sendChannelMessage(droppedCarapacesMsgs.join('\n'));
                }
            }
        });
    }
}