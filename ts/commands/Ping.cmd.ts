import {
    Message,
    PossiblyUncachedMessage,
    PossiblyUncachedTextableChannel,
} from 'eris';
import { Bot } from '../Client';
import { _Command } from '../managers/CommandManager';

export default class Ping extends _Command {
    constructor() {
        super('ping', 'ping...', ['pong']);
    }

    public async execute(
        msg: Message<PossiblyUncachedTextableChannel>,
        args: string[],
        client: Bot,
    ) {
        client.createMessage(msg.channel.id, 'Pong!');
    }
}
