const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const chatbot = require(process.cwd() + '/Structure/Function/chatbot');

const userdataPath = process.cwd() + '/Structure/Storage/ChatBot/userdata.json';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chatbot')
        .setDescription('Enables chatbot mode?')
        .addBooleanOption((opt) =>
            opt
                .setName('enable')
                .setDescription('Set to enabled?')
                .setRequired(true)
        ),
    exec(cli, inter) {
        const { options, user } = inter;

        const enabled = options.getBoolean('enable');
        let userdata = chatbot.userLoad(userdataPath);

        let status;
        switch (true) {
            case enabled == userdata[user.id]:
                {
                    if (userdata[user.id] == true) status = 0;
                    if (userdata[user.id] == false) status = 1;
                }
                break;
            case enabled != userdata[user.id]:
                {
                    if (enabled == true) {
                        userdata[user.id] = true;
                        chatbot.userSave(userdataPath, userdata);
                        status = 2;
                    }
                    if (enabled == false) {
                        userdata[user.id] = false;
                        chatbot.userSave(userdataPath, userdata);
                        status = 3;
                    }
                }
                break;
        }

        const titleArr = [
            'Already Enables',
            'Already Disables',
            'Enabled',
            'Disabled'
        ];
        const descArr = [
            `The chatbot mode is already enabled!`,
            `The chatbot mode is already disabled!`,
            `Chatbot mode is now enabled! You can talk to it now.`,
            `Chatbot mode is now disabled! You're no longer able talk to it now.`
        ];
        const responseEmbed = new EmbedBuilder()
            .setColor(cli.color)
            .setTitle(`Chatbot ${titleArr[status]}`)
            .setDescription(`${descArr[status]}`)
            .setFooter({
                text: cli.user.username,
                iconURL: cli.user.displayAvatarURL({ dynamic: true })
            });

        inter.reply({
            embeds: [responseEmbed],
            ephemeral: true
        });
    }
};
