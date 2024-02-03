const chatbot = require(process.cwd() + '/Structure/Function/chatbot');

const datasetPath = process.cwd() + '/Structure/Storage/ChatBot/dataset.json';
const userDataPath = process.cwd() + '/Structure/Storage/ChatBot/userdata.json';

module.exports = {
    name: 'Chatbot',
    type: 'messageCreate',
    async exec(message, cli) {
        const { author, content, channel } = message;

        let dataset = chatbot.load(datasetPath);
        let userdata = chatbot.userLoad(userDataPath);

        if (author.bot) return;
        if (channel.id !== cli.settings.chatbot.channelId) return;
        if (cli.settings.chatbot.enabled == false) return;
        if (userdata[author.id] === false) return;
        await channel.sendTyping();

        if (!Object.keys(userdata).includes(author.id)) {
            userdata[author.id] = false;
            channel.send({
                content: `Hwloo ${author}! I'm ${cli.user.username}, a chatbot created by ${await cli.users.fetch(cli.settings.ownerID)}.\nI saw that you're new here, by default i'm not gonna be able to chat with you so im not bothering you, but you can use </chatbot:0> commands to enable chatbot mode if you want~.\nBtw, I'm only able to chat with you but sadly i'm not trained to answer your questions. But i'll try my best to understand!`
            });
            return chatbot.save(userDataPath, userdata);
        }

        const input = content.toLowerCase();

        const category = chatbot.categorizeInput(input, dataset);
        const response = chatbot.response(input, dataset);

        console.log(category, response);

        await channel.send(response.generate);
    }
};
