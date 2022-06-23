import { Bot } from './Client';
const token: string = require('../token.json').token_dev;
const bot = new Bot(token, {
    intents: ['guilds', 'guildMembers', 'guildMessages'],
});

bot.start();
