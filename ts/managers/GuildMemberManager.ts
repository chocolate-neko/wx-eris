import { Guild, Member } from 'eris';
import { Bot } from '../Client';

export default class GuildMemberManager {
    public static memberJoin(guild: Guild, member: Member, client: Bot) {
        if (guild.systemChannelID === null) return;
        client.createMessage(guild.systemChannelID, {
            content: member.mention,
            embed: {
                title: `Welcome ${member.username} to ${guild.name}!`,
                color: 3181503,
                footer: {
                    text: `Joined at date: ${new Date().toDateString()} (SGT)`,
                },
            },
        });
    }
}
