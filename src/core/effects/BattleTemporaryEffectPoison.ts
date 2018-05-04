import BattleTemporaryEffect from './BattleTemporaryEffect';
import EffectId from './EffectId';
import { EMBED_COLORS } from "../../bot/util/ChatHelpers";

export default class BattleTemporaryEffectPoison extends BattleTemporaryEffect{
    constructor(id:EffectId,title:string,damagePerRound:number){
        super({
            id: id,
            title: title,
            onRoundBegin:function(e){
                e.target.hpCurrent -= damagePerRound;

                e.battle.queueBattleMessage([`-${e.target.title} ${e.target.hpCurrent}/${e.target.stats.hpTotal} lost ${damagePerRound}HP from ${this.title}`]);
            }
        });
    }
}