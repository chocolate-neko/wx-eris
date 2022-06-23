import { Message, PossiblyUncachedTextableChannel } from 'eris';

export class GuildUtils {
    public static getGuildIDFromMessage(
        msg: Message<PossiblyUncachedTextableChannel>,
    ): string {
        return msg.guildID ?? '0';
    }
}
