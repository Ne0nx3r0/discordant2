import BattleTemporaryEffect from './BattleTemporaryEffect';
import EmbedColors from '../../util/EmbedColors';
import EffectId from './EffectId';

export default class BattleTemporaryEffectPoison extends BattleTemporaryEffect{
    constructor(id:EffectId,title:string,damagePerRound:number){
        super({
            id: id,
            title: title,
            onRoundBegin:function(bag){
                bag.target.HPCurrent -= damagePerRound;

                bag.sendBattleEmbed(`${bag.target.title} ${bag.target.HPCurrent}/${bag.target.stats.HPTotal} lost ${damagePerRound}HP from ${this.title}`,EmbedColors.POISON);
            }
        });
    }
}