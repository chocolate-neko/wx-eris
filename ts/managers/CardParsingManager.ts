import { EmbedOptions } from 'eris';
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
    { text: '[Constant]', emote: '' },
    { text: '[Enter]', emote: '' },
    { text: '[Auto]', emote: '' },
    { text: '[Use Conditions]', emote: '' },
    { text: '[Action]', emote: '' },
    { text: '[Team]', emote: '' },
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

    public static async cardIDSearch(
        search: string,
    ): Promise<EmbedOptions | undefined> {
        const card =
            await sql`SELECT * FROM wixoss_en WHERE SIMILARITY ( card_no, ${search} ) > 0.25`;

        if (card.length == 0) return undefined;

        return {
            color: this.checkColours(card[0].color).value,
            image: {
                url: `https://www.takaratomy.co.jp/products/en.wixoss/card/thumb/${card[0].card_no}.jpg`,
            },
            title: card[0].name,
            description: this.checkEmpty(card[0].content),
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
        };
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
