const { EmbedBuilder } = require('discord.js');

module.exports = {
    cooldown: 10000,
    name: 'selectStringTest',
    id: 'testStringMenu',
    exec(cli, inter) {
        const opt = inter.values[0];

        const embed = new EmbedBuilder()
            .setColor(cli.color)
            .setTitle('Stringify')
            .setDescription(opt);

        inter.reply({
            embeds: [embed]
        });
    }
};
