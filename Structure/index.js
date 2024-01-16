process.on('unhandledRejection', (e) => console.error(e));

const { startUptime } = require("repl.uptime");
startUptime();

console.clear();
console.log('Replit Started')
require('../Website/Server/express');

const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { Guilds, GuildMembers, GuildMessages, MessageContent, GuildBans, GuildVoiceStates } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages, MessageContent, GuildBans, GuildVoiceStates],
  partials: [User, Message, GuildMember, ThreadMember]
});

const { events } = require('./Handlers/allInOneHandler')

client.settings = require('./Storage/config.json')
client.gColor = client.settings.globalColor;
client.prefix = client.settings.prefix;

client.legacy = new Collection();
client.aliases = new Collection();
client.events = new Collection();
client.commands = new Collection();
client.buttons = new Collection();

events(client);

client.login(process.env.Token)
  .catch(e => console.error(e));