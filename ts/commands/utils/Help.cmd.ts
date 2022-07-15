import { Message, PossiblyUncachedTextableChannel } from 'eris';
import { Bot, COMMAND_PREFIX } from '../../Client';
import { CommandManager, _Command } from '../../managers/CommandManager';

export default class Help implements _Command {
    name: string;
    description: string;
    aliases?: string[] | undefined;
    usage?: string | undefined;
    category?: string | undefined;
    guildOnly?: boolean | undefined;
    authorOnly?: boolean | undefined;

    constructor() {
        this.name = 'help';
        this.description = 'Displays a help dialog of available commands';
        this.aliases = ['h', '?'];
    }

    public async execute(
        msg: Message<PossiblyUncachedTextableChannel>,
        args: string[],
        client: Bot,
    ) {
        const commands = CommandManager.getCommands();
        let commandList: string = '';
        commands.forEach((command) => {
            commandList += `\`${COMMAND_PREFIX}${command.name}\` | ${command.description}\n`;
        });

        client.createMessage(
            msg.channel.id,
            `**__Help Command (Under Construction)__**\n${commandList}`,
        );
    }
}
