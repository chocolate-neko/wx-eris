import { Message, PossiblyUncachedTextableChannel } from 'eris';
import { Bot, COMMAND_PREFIX } from '../Client';
import FileManager from './FileManager';

export class CommandManager {
    private static commands: Map<string, _Command> = new Map<
        string,
        _Command
    >();

    public static loadCommands(path: string): void {
        const files = FileManager.recurssiveWalk(path, (f) =>
            /.cmd.js$/.test(f),
        );
        if (files.length == 0) {
            console.log(`[${this.name.toUpperCase()}] No commands found.`);
            return;
        }
        for (const file of files) {
            const command: _Command = new (require(file).default)();
            if (command.name) {
                this.commands.set(command.name, command);
                console.log(
                    `[${this.name.toUpperCase()}] Successfully loaded command ${
                        command.name
                    } (Path: ${file})`,
                );
            } else {
                console.log(
                    `[${this.name.toUpperCase()} / ERR] Command file skipped... (Path: ${file})`,
                );
            }
        }
    }

    public static parseCommand(msgContent: string): string {
        return msgContent.split(' ')[0].replace(COMMAND_PREFIX, '').trim();
    }

    public static parseArgs(msgContent: string): string[] {
        const splitMsg = msgContent.split(' ');
        if (splitMsg.length <= 1) return [];
        return splitMsg.slice(1, splitMsg.length);
    }

    public static getCommand(name: string): _Command | undefined {
        // return this.commands.get(name);
        const commandWithName = this.commands.get(name);
        if (commandWithName) return commandWithName;

        let commandWithAlias: _Command | undefined = undefined;
        const commandArr = this.getCommands();

        for (let i = 0; i < commandArr.length; i++) {
            if (
                commandArr[i].aliases &&
                (commandArr[i].aliases ?? []).includes(name)
            ) {
                commandWithAlias = commandArr[i];
                break;
            }
        }
        return commandWithAlias;
    }

    public static getCommands(): _Command[] {
        return Array.from(this.commands.values());
    }

    public static getCommandsAsMap(): Map<string, _Command> {
        return this.commands;
    }
}

export interface _Command {
    name: string;
    description: string;
    aliases?: string[];
    usage?: string;
    category?: string;
    guildOnly?: boolean;
    authorOnly?: boolean;

    // public constructor(
    //     name: string,
    //     description: string,
    //     aliases?: string[],
    //     usage?: string,
    //     category?: string,
    //     guildOnly?: boolean,
    // ) {
    //     this.name = name;
    //     this.description = description;
    //     this.aliases = aliases ?? [];
    //     this.usage = usage ?? '';
    //     this.category = category ?? 'Default';
    //     this.guildOnly = guildOnly ?? false;
    // }

    execute(
        msg: Message<PossiblyUncachedTextableChannel>,
        args: string[],
        client: Bot,
    ): Promise<void>;
}
