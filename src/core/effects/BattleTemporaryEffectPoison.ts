import BattleTemporaryEffect from './BattleTemporaryEffect';
import EffectId from './EffectId';
import { EMBED_COLORS } from "../../bot/util/ChatHelpers";

export default class BattleTemporaryEffectPoison extends BattleTemporaryEffect{
    constructor(id:EffectId,title:string,damagePerRound:number){
        super({
            id: id,
            title: title,
            onRoundBegin:function(bag){
                bag.target.HPCurrent -= damagePerRound;

                bag.sendBattleEmbed(`${bag.target.title} ${bag.target.HPCurrent}/${bag.target.stats.HPTotal} lost ${damagePerRound}HP from ${this.title}`,EMBED_COLORS.POISON);
            }
        });
    }
}