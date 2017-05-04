import BattleTemporaryEffect from './BattleTemporaryEffect';
import EffectId from './EffectId';
import { EMBED_COLORS } from "../../bot/util/ChatHelpers";

export default class BattleTemporaryEffectPoison extends BattleTemporaryEffect{
    constructor(id:EffectId,title:string,damagePerRound:number){
        super({
            id: id,
            title: title,
            onRoundBegin:function(bag){
                bag.target.hpCurrent -= damagePerRound;

                bag.sendBattleEmbed([`-${bag.target.title} ${bag.target.hpCurrent}/${bag.target.stats.hpTotal} lost ${damagePerRound}HP from ${this.title}`]);
            }
        });
    }
}