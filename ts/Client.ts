import Eris, { Client, ClientOptions, Constants } from 'eris';
import FileManager from './managers/FileManager';
import UserUtils from './utils/UserUtils';
import { CommandManager } from './managers/CommandManager';
import WikiManager from './managers/WikiManagerV2';
import DBManager from './managers/DBManager';
import CardParsingManager from './managers/CardParsingManager';
import InteractionManager from './managers/InteractionManager';

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
        // DBManager.pushToDB();
        this.connect();
        // console.log(await WikiManager.parseWikiHTML('Pinch_Defense'));
        this.once('ready', async () => {
            // const commands = await this.getCommands();
            // console.log(commands);
            // if (!commands.length) {

            this.bulkEditGuildCommands('959812566677340271', [
                {
                    name: 'search',
                    description: 'Search for cards (users soon!)',
                    type: Constants.ApplicationCommandTypes.CHAT_INPUT,
                    options: [
                        {
                            name: 'card',
                            description: 'Search a card by...',
                            type: Constants.ApplicationCommandOptionTypes
                                .SUB_COMMAND_GROUP,
                            options: [
                                {
                                    name: 'by-name',
                                    description: 'Search for a card by name',
                                    type: Constants
                                        .ApplicationCommandOptionTypes
                                        .SUB_COMMAND,
                                    options: [
                                        {
                                            name: 'name',
                                            description: 'The card name',
                                            type: Constants
                                                .ApplicationCommandOptionTypes
                                                .STRING,
                                            required: true,
                                        },
                                    ],
                                },
                                {
                                    name: 'by-id',
                                    description:
                                        'Search for a card by Wixoss card ID',
                                    type: Constants
                                        .ApplicationCommandOptionTypes
                                        .SUB_COMMAND,
                                    options: [
                                        {
                                            name: 'id',
                                            description: 'The card ID',
                                            type: Constants
                                                .ApplicationCommandOptionTypes
                                                .STRING,
                                            required: true,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ]);
            // }

            // ############################################

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

        this.on('messageCreate', async (msg) => {
            if (
                /https:\/\/wixoss.fandom.com\/wiki\/.*[^\/]/g.test(
                    msg.content,
                ) &&
                msg.content.charAt(0) !== '!'
            ) {
                const urlEmbed = await CardParsingManager.wikiURLSearch(
                    msg.content,
                );
                if (urlEmbed) {
                    urlEmbed.embed.footer!.text +=
                        '\nuse ! infront of a wiki link to prevent pop-ups';
                    this.createMessage(msg.channel.id, {
                        embed: urlEmbed.embed,
                    });
                }
            }

            if (!msg.content.includes(COMMAND_PREFIX)) return;
            if (msg.author.bot) return;
            const commandName = CommandManager.parseCommand(msg.content);
            const command = CommandManager.getCommand(commandName);
            if (command === undefined) {
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

        this.on('error', (error) => {
            console.error(error);
        });

        this.on('interactionCreate', async (interaction) => {
            InteractionManager.parseCommandInteraction(interaction);
            // if (interaction instanceof Eris.CommandInteraction) {
            //     switch (interaction.data.name) {
            //         case 'card_name_search':
            //             if (interaction.data.options) {
            //                 const embed = await CardParsingManager.cardSearch(
            //                     (<any>interaction.data.options[0]).value,
            //                     'name',
            //                 );
            //                 if (embed)
            //                     return interaction.createMessage({
            //                         embeds: [embed.embed],
            //                     });
            //             }
            //             return interaction.createMessage('No cards found');
            //         // interaction.createMessage('boop');
            //         // if (interaction.data.options) {
            //         //     const messages = interaction.data.options;
            //         //     console.log(messages);
            //         // }
            //         // const embed = await CardParsingManager.cardSearch(
            //         //     (
            //         //         await interaction.getOriginalMessage()
            //         //     ).content,
            //         // );
            //         // if (embed)
            //         //     return this.createMessage(interaction.channel.id, {
            //         //         embed: embed.embed,
            //         //     });
            //         // return this.createMessage(
            //         //     interaction.channel.id,
            //         //     'Card not found or not a valid name',
            //         // );
            //     }
            // }
        });
    }
}
