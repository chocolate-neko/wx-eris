import { Message, PossiblyUncachedTextableChannel } from 'eris';
import { Bot } from '../../Client';
import { _Command } from '../../managers/CommandManager';

export default class Eval implements _Command {
    name: string;
    description: string;
    aliases?: string[] | undefined;
    usage?: string | undefined;
    category?: string | undefined;
    guildOnly?: boolean | undefined;
    authorOnly?: boolean | undefined;

    constructor() {
        this.name = 'eval';
        this.description = 'Evaluates JavaScript code (Dangerous, do not use)';
        this.authorOnly = true;
    }

    public async execute(
        msg: Message<PossiblyUncachedTextableChannel>,
        args: string[],
        client: Bot,
    ) {
        client.createMessage(
            msg.channel.id,
            `\`\`\`${eval(args.join(' ').replace('```', ''))}\`\`\``,
        );
    }
}
