const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    cooldown: 2000,
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Say something as the bot!')
        .addStringOption((opt) =>
            opt
                .setName('text')
                .setDescription('Say something as the bot!')
                .setRequired(true)
        )
        .addBooleanOption((opt) =>
            opt
                .setName('reply')
                .setDescription('Choose to send the text with reply or not!')
        )
        .addBooleanOption((opt) =>
            opt.setName('embeds').setDescription('Say with an fancy embeds')
        ),
    exec(cli, inter) {
        const { channel, options } = inter;

        const text = options.getString('text');
        const reply = options.getBoolean('reply');
        const embed = options.getBoolean('embeds');

        const textEmbed = new EmbedBuilder()
            .setColor(cli.color)
            .setDescription(text);

        if (reply) {
            if (embed) {
                inter.reply({ embeds: [textEmbed] });
            } else {
                inter.reply({ content: text });
            }
        } else {
            if (embed) {
                channel.send({ embeds: [textEmbed] });
                inter.reply({ content: 'Sent!', ephemeral: true });
            } else {
                channel.send({ content: text });
                inter.reply({ content: 'Sent!', ephemeral: true });
            }
        }
    }
};
