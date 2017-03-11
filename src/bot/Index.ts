import BotConfig from '../../Config.Bot';

class DiscordantBotNode {
    public static main(): number {
        

        return 0;
    }
}
                                                          
DiscordantBotNode.main();

process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: \n" + err.stack);
});