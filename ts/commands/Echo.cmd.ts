import { Message, PossiblyUncachedTextableChannel } from 'eris';
import { Bot } from '../Client';
import { _Command } from '../managers/CommandManager';

export default class Echo implements _Command {
    name: string;
    description: string;
    aliases?: string[] | undefined;
    usage?: string | undefined;
    category?: string | undefined;
    guildOnly?: boolean | undefined;

    constructor() {
        this.name = 'echo';
        this.description = 'Echos the text back to the user with their mention';
    }

    public async execute(
        msg: Message<PossiblyUncachedTextableChannel>,
        args: string[],
        client: Bot,
    ) {
        let formatArg = '';
        if (args[0].includes('-'))
            formatArg = (args.shift() ?? '').replace('-', '');
        let text = args.join(' ');
        let formattedText;

        switch (formatArg.toLowerCase()) {
            case 'reverse':
                formattedText = this.reverse(text);
                break;
            default:
                formattedText = text;
                break;
        }

        client.createMessage(
            msg.channel.id,
            `${msg.author.mention}\n${formattedText}`,
        );
    }

    private reverse(txt: string) {
        const chars = txt.split('');
        const reversed = chars.reverse().join('');

        return reversed;
    }
}
