// Prevent crash on unhandled rejection
process.on('unhandledRejection', (e) => console.error(e));

console.clear();
console.log('Replit Started');
require('../Website/Server/express'); // Start the express server

// Destructuring some stuff from discord.js
const {
    Client,
    Collection,
    GatewayIntentBits,
    Partials
} = require('discord.js');
// Destructuring even more stuff from discord.js GatewayIntentBits
const {
    AutoModerationConfiguration,
    AutoModerationExecution,
    DirectMessageReactions,
    DirectMessageTyping,
    DirectMessages,
    GuildEmojisAndStickers,
    GuildIntegrations,
    GuildInvites,
    GuildMembers,
    GuildMessageReactions,
    GuildMessageTyping,
    GuildMessages,
    GuildModeration,
    GuildPresences,
    GuildScheduledEvents,
    GuildVoiceStates,
    GuildWebhooks,
    Guilds,
    MessageContent
} = GatewayIntentBits;
const intents = [
    AutoModerationConfiguration,
    AutoModerationExecution,
    DirectMessageReactions,
    DirectMessageTyping,
    DirectMessages,
    GuildEmojisAndStickers,
    GuildIntegrations,
    GuildInvites,
    GuildMembers,
    GuildMessageReactions,
    GuildMessageTyping,
    GuildMessages,
    GuildModeration,
    GuildPresences,
    GuildScheduledEvents,
    GuildVoiceStates,
    GuildWebhooks,
    Guilds,
    MessageContent
];
// More destructuring from discord.js Partials
const { User, Message, GuildMember, ThreadMember } = Partials;

// Create a new client instance
const client = new Client({
    intents: intents,
    partials: [User, Message, GuildMember, ThreadMember]
});

// Import events handlers from the handler folder
const { events } = require('./Handlers/allInOneHandler');

// Config.json settings related
client.settings = require('./Storage/config.json');
client.color = client.settings.globalColor;
client.prefix = client.settings.prefix;

// Creating a new collection for all the interaction
client.events = new Collection();
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.contexts = new Collection();

// Load events handlers
events(client);

// Login to the bot
client
    .login(process.env.Token)
    .catch((e) => console.error('Unable to connect to discord: ', e));
// Catch any error that happens

//client.on('debug', console.log).on('warn', console.log);
