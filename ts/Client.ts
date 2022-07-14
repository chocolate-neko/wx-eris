import { Client, ClientOptions } from 'eris';
import FileManager from './managers/FileManager';
import UserUtils from './utils/UserUtils';
import { CommandManager } from './managers/CommandManager';
import WikiManager from './managers/WikiManagerV2';

// The path to the directory containing the commands.
// No changes required unless directory is renamed or moved.
const commandPath = './js';
export const COMMAND_PREFIX = 'w!';

interface _ClientOptions extends ClientOptions {
    author: { name: string; id: string };
}

export class Bot extends Client {
    constructor(token: string, options?: _ClientOptions) {
        super(token, options);
    }

    public async start() {
        // let data: any[] = await WikiManager.getWikiData(
        //     `https://wixoss.fandom.com/api.php?action=parse&page=Pinch_Defense&prop=text&format=json`,
        // );

        // console.log(data);

        // console.log(FileManager.recurssiveWalk('./js', (f) => /.js$/.test(f)));
        CommandManager.loadCommands(commandPath);
        this.connect();
        // console.log(await WikiManager.parseWikiHTML('Pinch_Defense'));
        this.once('ready', () => {
            this.editStatus({
                name: `... ${COMMAND_PREFIX} to call`,
                type: 1,
                url: 'https://www.youtube.com/watch?v=47rVj873MOw',
            });
            console.log(
                `[${this.constructor.name.toUpperCase()}] ${
                    this.user.username
                }#${this.user.discriminator} successfully connected online!`,
            );
        });

        this.on('messageCreate', (msg) => {
            if (!msg.content.includes(COMMAND_PREFIX)) return;
            if (msg.author.bot) return;
            const commandName = CommandManager.parseCommand(msg.content);
            const command = CommandManager.getCommand(commandName);
            if (command === false) {
                this.createMessage(
                    msg.channel.id,
                    `Command \`${commandName}\` is not a valid command`,
                ).then((msg) => {
                    setTimeout(() => {
                        msg.delete();
                    }, 5000);
                });
                return;
            }

            if (
                command.authorOnly &&
                msg.author.id !== (<_ClientOptions>this.options).author.id
            ) {
                this.createMessage(
                    msg.channel.id,
                    `Command \`${commandName}\` can only be executed by ${
                        (<_ClientOptions>this.options).author.name
                    }`,
                );
                return;
            }

            command.execute(msg, CommandManager.parseArgs(msg.content), this);
            return;
        });
    }
}
