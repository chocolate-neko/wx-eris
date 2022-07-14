import { Bot } from './Client';
const token: string = require('../token.json').token;
const bot = new Bot(token, {
    intents: ['guilds', 'guildMembers', 'guildMessages'],
    author: { name: 'cococat🍫#7225', id: '170752668854255617' },
});

bot.start();
