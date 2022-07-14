import { Message, PossiblyUncachedTextableChannel } from 'eris';
import { Bot } from '../Client';
import { _Command } from '../managers/CommandManager';

export default class Arg implements _Command {
    name: string;
    description: string;
    aliases?: string[] | undefined;
    usage?: string | undefined;
    category?: string | undefined;
    guildOnly?: boolean | undefined;
    authorOnly?: boolean;

    constructor() {
        this.name = 'argTest';
        this.description = 'An argument test';
        this.authorOnly = true;
    }

    public async execute(
        msg: Message<PossiblyUncachedTextableChannel>,
        args: string[],
        client: Bot,
    ) {
        client.createMessage(
            msg.channel.id,
            (args.length == 0 ? ['emptyArgs'] : args).join(', '),
        );
    }
}
