import { Message, PossiblyUncachedTextableChannel } from 'eris';
import { Bot } from '../../Client';
import { _Command } from '../../managers/CommandManager';

export default class Eval implements _Command {
    name: string;
    description: string;
    aliases?: string[] | undefined;
    usage?: string | undefined;
    category?: string | undefined;
    guildOnly?: boolean | undefined;
    authorOnly?: boolean | undefined;

    constructor() {
        this.name = 'eval';
        this.description = 'Evaluates JavaScript code (Dangerous, do not use)';
        this.authorOnly = true;
    }

    public async execute(
        msg: Message<PossiblyUncachedTextableChannel>,
        args: string[],
        client: Bot,
    ) {
        // client.createMessage(
        //     msg.channel.id,
        //     `\`\`\`${eval(
        //         args
        //             .join(' ')
        //             .replace(/(^\`{3}js(\n|\s)*)|((\n|\s)*\`{3}$)/g, ''),
        //     )}\`\`\``,
        // );
        const code = args
            .join(' ')
            .replace(/(^\`{3}js(\n|\s)*)|((\n|\s)*\`{3}$)/g, '');
        const result = new Promise<string>((resolve: any, reject: any) =>
            resolve(eval(code)),
        );

        return result
            .then((output) => {
                if (typeof output !== 'string') {
                    output = require('util').inspect(output, {
                        depth: 1,
                    });
                }
                if (output.includes((<any>client)._token!)) {
                    output = output.replace(
                        (<any>client)._token!,
                        'token.1234.nicetry',
                    );
                }
                client.createMessage(
                    msg.channel.id,
                    `\`\`\`js\n${output.substring(0, 1900)}\n\`\`\``,
                );
            })
            .catch((err) => {
                err = err.toString();
                if (err.includes((<any>client)._token)) {
                    err = err.replace(
                        (<any>client)._token,
                        'token.1234.nicetry',
                    );
                }
                client.createMessage(
                    msg.channel.id,
                    `\`\`\`js\n${err.substring(0, 1900)}\n\`\`\``,
                );
            });
    }
}
