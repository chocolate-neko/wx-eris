import { Message, PossiblyUncachedTextableChannel } from 'eris';
import { Bot } from '../../Client';
import CardParsingManager from '../../managers/CardParsingManager';
import { _Command } from '../../managers/CommandManager';

export default class CardIDSearch implements _Command {
    name: string;
    description: string;
    aliases?: string[] | undefined;
    usage?: string | undefined;
    category?: string | undefined;
    guildOnly?: boolean | undefined;
    authorOnly?: boolean | undefined;

    constructor() {
        this.name = 'namesearch';
        this.description = 'Search for cards by name';
        this.aliases = ['cn', 'cname'];
    }

    public async execute(
        msg: Message<PossiblyUncachedTextableChannel>,
        args: string[],
        client: Bot,
    ): Promise<void> {
        const embed = await CardParsingManager.cardSearch(
            args.join(' '),
            'name',
        );
        if (!embed)
            client.createMessage(msg.channel.id, 'No results or invalid name');
        else {
            let possibleMatchList: string = 'Possible Matches:\n';
            for (let i = 1; i < 6; i++) {
                try {
                    possibleMatchList += `(${i}) ${embed.possibleMatches[i].name} [${embed.possibleMatches[i].card_no}]\n`;
                } catch (e) {
                    break;
                }
            }
            client.createMessage(msg.channel.id, { embed: embed.embed });
            client.createMessage(msg.channel.id, possibleMatchList);
        }
    }
}
