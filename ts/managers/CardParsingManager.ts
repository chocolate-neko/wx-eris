import { EmbedOptions } from 'eris';
import { Row, RowList } from 'postgres';
import sql from './DB';

const cardColours = [
    { color: 'R', name: 'Red', value: 15675183 },
    { color: 'G', name: 'Green', value: 3457307 },
    { color: 'U', name: 'Blue', value: 1725884 },
    { color: 'B', name: 'Black', value: 3414619 },
    { color: 'W', name: 'White', value: 16381900 },
    { color: 'C', name: 'Colourless', value: 8355711 },
];

const emoteReplace = [
    { text: '[Constant]', emote: '<:Const:1005444057725669397>' },
    { text: '[Enter]', emote: '<:Enter:1005444060053524541>' },
    { text: '[Auto]', emote: '<:Auto:1005444056106668052>' },
    {
        text: '[Use Conditions]',
        emote: '<:UseCondition_1:1005478149586432070><:UseCondition_2:1005478151331262526>',
    },
    { text: '[Action]', emote: '<:Action:1005444054080835655>' },
    { text: '[Team]', emote: '' },
    {
        text: '[Rise]',
        emote: '<:Rise_1:1005480238437908480><:Rise_2:1005480240631521340>',
    },
    { text: '{Colorless}', emote: '' },
    { text: '{Red}', emote: '' },
    { text: '{Green}', emote: '' },
    { text: '{Blue}', emote: '' },
    { text: '{Black}', emote: '' },
    { text: '{White}', emote: '' },
    { text: '{Down}', emote: '' },
];
export default class CardParsingManager {
    // public static cardNameSearch(search: string): EmbedOptions[] {

    // }

    public static async cardSearch(
        search: string,
        match: string = 'card_no',
    ): Promise<
        { embed: EmbedOptions; possibleMatches: RowList<Row[]> } | undefined
    > {
        let card = await this.sqlStatementSwitch(search, match)[0];

        if (card.length == 0) {
            card = await this.sqlStatementSwitch(search, match)[1];
        }

        if (card.length == 0) return undefined;

        return {
            embed: {
                color: this.checkColours(card[0].color).value,
                image: {
                    url: `https://www.takaratomy.co.jp/products/en.wixoss/card/thumb/${card[0].card_no}.jpg`,
                },
                title: card[0].name,
                description: this.replaceTextWithEmotes(
                    this.checkEmpty(card[0].content),
                ),
                fields: [
                    {
                        name: 'Color',
                        value: this.checkEmpty(
                            this.checkColours(card[0].color).name,
                        ),
                        inline: true,
                    },
                    {
                        name: 'Type',
                        value: this.checkEmpty(card[0].card_type),
                        inline: true,
                    },
                    {
                        name: 'Level',
                        value: this.checkEmpty(card[0].level),
                        inline: true,
                    },
                    {
                        name: 'Rarity',
                        value: this.checkEmpty(card[0].rarity),
                        inline: false,
                    },
                    {
                        name: 'Grow Cost',
                        value: this.checkEmpty(card[0].grow_cost),
                        inline: true,
                    },
                    {
                        name: 'Power',
                        value: this.checkEmpty(card[0].power),
                        inline: true,
                    },
                ],
                footer: {
                    text: `Card ID [EN]: ${card[0].card_no} | Card ID [JP]: ${card[0].JPN_card_no}`,
                },
            },
            possibleMatches: card,
        };
    }

    public static async wikiURLSearch(url: string) {
        const name = url.substring(url.lastIndexOf('/') + 1);
        const embed = await this.cardSearch(name, 'name');
        return embed?.embed;
    }

    private static sqlStatementSwitch(search: string, match: string) {
        switch (match) {
            case 'card_no':
                return [
                    sql`SELECT * FROM wixoss_en WHERE LOWER (card_no) LIKE LOWER (${
                        '%' + search + '%'
                    })`,
                    sql`SELECT * FROM wixoss_en WHERE SIMILARITY(card_no, ${search}) > 0.3 OR levenshtein(card_no, ${search}) < 4`,
                ];
            case 'name':
                return [
                    sql`SELECT * FROM wixoss_en WHERE LOWER (name) LIKE LOWER (${
                        '%' + search + '%'
                    })`,
                    sql`SELECT * FROM wixoss_en WHERE SIMILARITY(name, ${search}) > 0.8 OR levenshtein(name, ${search}) < 9`,
                ];
            default:
                return [
                    sql`SELECT * FROM wixoss_en`,
                    sql`SELECT * FROM wixoss_en`,
                ];
        }
    }

    private static replaceTextWithEmotes(content: string) {
        let text: string = content;

        // emoteReplace.forEach((replacement) => {
        //     text = content.replace(
        //         replacement.text,
        //         replacement.emote == '' ? replacement.text : replacement.emote,
        //     );
        // });

        for (let i = 0; i < emoteReplace.length; i++) {
            if (content.includes(emoteReplace[i].text)) {
                text = text.replaceAll(
                    emoteReplace[i].text,
                    emoteReplace[i].emote === ''
                        ? emoteReplace[i].text
                        : emoteReplace[i].emote,
                );
            }
        }

        return text;
    }

    private static checkEmpty(string: string) {
        return string === '' ? 'N/A' : string;
    }

    private static checkColours(colour: string) {
        switch (colour.charAt(0)) {
            case 'R':
                return cardColours[0];
            case 'G':
                return cardColours[1];
            case 'U':
                return cardColours[2];
            case 'B':
                return cardColours[3];
            case 'W':
                return cardColours[4];
            case 'C':
                return cardColours[5];
            default:
                return { color: 'undefined', name: 'undefined', value: 0 };
        }
    }
}
