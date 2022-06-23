import { Message, PossiblyUncachedTextableChannel, User } from 'eris';
import { Bot as Client } from '../Client';
import { GuildUtils } from './GuildUtils';

export default class UserUtils {
    public static changeBotNickname(
        client: Client,
        msg: Message<PossiblyUncachedTextableChannel>,
        nick: string,
    ): void {
        client
            .editGuildMember(GuildUtils.getGuildIDFromMessage(msg), '@me', {
                nick: nick,
            })
            .catch((err) => {
                console.error(err);
            });
    }

    public static changeBotStatus(client: Client, status: string): void {}

    /**
     * Returns a user using their ID.
     * @param id User ID
     */
    public static getUserFromID(id: string, client: Client): User | undefined {
        return client.users.get(id);
    }

    /**
     * Returns a user using their mention.
     * @param mention User mention
     */
    public static getUserFromMention(
        mention: string,
        client: Client,
    ): User | undefined {
        const id = mention.replace(/[<@!>]/g, '');
        return this.getUserFromID(id, client);
    }

    /**
     * Returns a server member using their ID.
     * @param id User ID
     * @param msg Message
     */
    public static getMemberFromID(
        id: string,
        msg: Message<PossiblyUncachedTextableChannel>,
        client: Client,
    ) {
        const guild = client.guilds.get(GuildUtils.getGuildIDFromMessage(msg));
        if (guild) {
            return guild.members.get(id);
        }
    }

    /**
     * Returns a server member using their mention.
     * @param mention User mention
     * @param msg Message
     */
    public static getMemberFromMention(
        mention: string,
        msg: Message<PossiblyUncachedTextableChannel>,
        client: Client,
    ) {
        const id = mention.replace(/[<@!>]/g, '');
        const guild = client.guilds.get(GuildUtils.getGuildIDFromMessage(msg));
        if (guild) {
            return guild.members.get(id);
        }
    }
}
