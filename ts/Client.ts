import { Client, ClientOptions } from 'eris';
import FileManager from './managers/FileManager';
import UserUtils from './utils/UserUtils';
import { CommandManager } from './managers/CommandManager';
import WikiManager from './managers/WikiManagerV2';

// The path to the directory containing the commands.
// No changes required unless directory is renamed or moved.
const commandPath = './js';

interface _ClientOptions extends ClientOptions {}

export class Bot extends Client {
    constructor(token: string, options?: _ClientOptions) {
        super(token, options);
    }

    public async start() {
        // let data: any[] = await WikiManager.getWikiData(
        //     `https://wixoss.fandom.com/api.php?action=parse&page=Pinch_Defense&prop=text&format=json`,
        // );

        // console.log(data);

        // console.log(FileManager.recurssiveWalk('./js', (f) => /.js$/.test(f)));
        // CommandManager.loadCommands(commandPath);
        // this.connect();
        WikiManager.parseWikiHTML('WXDi-D01_DIVA_DEBUT_DECK_ANCIENT_SURPRISE');
        this.on('ready', () => {
            console.log(
                `[${this.constructor.name.toUpperCase()}] ${
                    this.user.username
                }#${this.user.discriminator} successfully connected online!`,
            );
        });

        this.on('messageCreate', (msg) => {});
    }
}
