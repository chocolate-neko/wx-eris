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

    public static getCommand(name: string): _Command | undefined {
        return this.commands.get(name);
    }

    public static getCommands(): _Command[] {
        return Array.from(this.commands.values());
    }

    public static getCommandsAsMap(): Map<string, _Command> {
        return this.commands;
    }
}

export class _Command {
    public name: string;
    public description: string;
    public aliases: string[];
    public usage: string;
    public category: string;
    public guildOnly: boolean;

    public constructor(
        name: string,
        description: string,
        aliases?: string[],
        usage?: string,
        category?: string,
        guildOnly?: boolean,
    ) {
        this.name = name;
        this.description = description;
        this.aliases = aliases ?? [];
        this.usage = usage ?? '';
        this.category = category ?? 'Default';
        this.guildOnly = guildOnly ?? false;
    }
}
