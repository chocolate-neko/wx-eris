import { EmbedOptions, Message, PossiblyUncachedTextableChannel } from 'eris';
import { Bot } from '../Client';
import { _Command } from '../managers/CommandManager';

export default class TestEmbed implements _Command {
    name: string;
    description: string;
    aliases?: string[] | undefined;
    usage?: string | undefined;
    category?: string | undefined;
    guildOnly?: boolean | undefined;
    authorOnly?: boolean | undefined;

    constructor() {
        this.name = 'testCardDetailsEmbed';
        this.description = 'Card details embed';
        this.authorOnly = true;
    }

    public async execute(
        msg: Message<PossiblyUncachedTextableChannel>,
        args: string[],
        client: Bot,
    ): Promise<void> {
        const cardID_JP = 'WXDi-D03-013';
        const cardID = 'WXDi-D03-013[EN]';
        const embed: EmbedOptions = {
            color: 13113678,
            image: {
                url: `https://www.takaratomy.co.jp/products/en.wixoss/card/thumb/${cardID}.jpg`,
            },
            title: 'Lancelot, Crimson General',
            description:
                "[Enter] {Colorless}: Vanish target SIGNI on your opponent's field with power 5000 or less.",
            fields: [
                { name: 'Color', value: 'R', inline: true },
                { name: 'Type', value: 'SIGNI', inline: true },
                { name: 'Level', value: '2', inline: true },
                { name: 'Rarity', value: 'ST', inline: false },
                { name: 'Grow Cost', value: 'N/A', inline: true },
                { name: 'Power', value: '5000', inline: true },
            ],
            footer: {
                text: `Card ID [EN]: ${cardID} | Card ID [JP]: ${cardID_JP}`,
            },
        };

        client.createMessage(msg.channel.id, { embed: embed });
    }
}
