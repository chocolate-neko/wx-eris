import { Message, PossiblyUncachedTextableChannel } from 'eris';
import { Bot } from '../../Client';
import { _Command } from '../../managers/CommandManager';

export default class DiceRoll implements _Command {
    name: string;
    description: string;
    aliases?: string[] | undefined;
    usage?: string | undefined;
    category?: string | undefined;
    guildOnly?: boolean | undefined;
    authorOnly?: boolean | undefined;

    constructor() {
        this.name = 'dice';
        this.description =
            'Rolls a random number between 1 and a specified number';
    }

    public async execute(
        msg: Message<PossiblyUncachedTextableChannel>,
        args: string[],
        client: Bot,
    ) {
        if (parseInt(args[0]) === NaN) {
            client.createMessage(
                msg.channel.id,
                'Number not valid, please enter a valid number',
            );
            return;
        }

        client.createMessage(
            msg.channel.id,
            `${msg.author.mention}\nDice Roll: ${Math.ceil(
                Math.random() * parseInt(args[0]),
            )}`,
        );
    }
}
