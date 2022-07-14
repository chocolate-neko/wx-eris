import {
    Message,
    PossiblyUncachedMessage,
    PossiblyUncachedTextableChannel,
} from 'eris';
import { Bot } from '../Client';
import { _Command } from '../managers/CommandManager';

export default class Ping implements _Command {
    public name: string;
    public description: string;
    public aliases?: string[] | undefined;

    constructor() {
        this.name = 'ping';
        this.description = 'A ping command';
        this.aliases = ['pong'];
    }

    public async execute(
        msg: Message<PossiblyUncachedTextableChannel>,
        args: string[],
        client: Bot,
    ) {
        client.createMessage(msg.channel.id, 'Pong!');
    }
}
