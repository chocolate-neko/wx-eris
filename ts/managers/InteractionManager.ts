import Eris, {
    CommandInteraction,
    Constants,
    InteractionDataOptions,
} from 'eris';
import CardParsingManager from './CardParsingManager';

export default class InteractionManager {
    public static async parseCommandInteraction(
        interaction:
            | Eris.PingInteraction
            | Eris.CommandInteraction<Eris.TextableChannel>
            | Eris.ComponentInteraction<Eris.TextableChannel>
            | Eris.AutocompleteInteraction<Eris.TextableChannel>
            | Eris.UnknownInteraction<Eris.TextableChannel>,
    ) {
        if (interaction instanceof Eris.CommandInteraction) {
            switch (interaction.data.name) {
                case 'search':
                    const interactionResult = await this.searchInteraction(
                        interaction.data.options,
                    );
                    if (
                        interactionResult &&
                        interactionResult.type === 'card'
                    ) {
                        if (interactionResult.response)
                            return interaction.createMessage({
                                embeds: [interactionResult.response.embed],
                            });
                        return interaction.createMessage('No card found');
                    }
            }
        }
    }

    private static async searchInteraction(options?: InteractionDataOptions[]) {
        if (options === undefined) return;

        const interaction = options[0];
        switch (interaction.name) {
            case 'card':
                if (
                    interaction.type ===
                    Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP
                ) {
                    return {
                        response: await this.cardSearchInteraction(
                            interaction.options,
                        ),
                        type: 'card',
                    };
                }
        }
    }

    private static async cardSearchInteraction(
        options?: InteractionDataOptions[],
    ) {
        if (options === undefined) return;

        const interaction = options[0];
        switch (interaction.name) {
            case 'by-name':
                if (
                    interaction.type ===
                    Constants.ApplicationCommandOptionTypes.SUB_COMMAND
                ) {
                    const embed = await CardParsingManager.cardSearch(
                        (<any>interaction.options![0]).value,
                        'name',
                    );
                    if (embed) return embed;
                    return undefined;
                }
                break;
            case 'by-id':
                if (
                    interaction.type ===
                    Constants.ApplicationCommandOptionTypes.SUB_COMMAND
                ) {
                    const embed = await CardParsingManager.cardSearch(
                        (<any>interaction.options![0]).value,
                        'card_no',
                    );
                    if (embed) return embed;
                    return undefined;
                }
                break;
        }
    }
}
