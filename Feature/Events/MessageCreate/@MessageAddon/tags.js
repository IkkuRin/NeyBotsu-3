const randRes = require(process.cwd() + '/Structure/Modules/randomResponse');
const { EmbedBuilder } = require('discord.js');

function meTags(message, cli) {
    if (message.author.bot) return;
    if (!message.mentions.has(cli.user.id)) return;
    const prop = randRes('tagEvent', 'response', message, cli).embeds();

    message.channel.sendTyping();

    const embeds = new EmbedBuilder()
        .setColor(cli.color)
        .setThumbnail(cli.user.displayAvatarURL({ dynamic: true }))
        .setTitle(prop.title)
        .setDescription(prop.description)
        .setFooter({
            text: cli.user.username,
            iconURL: cli.user.displayAvatarURL({ dynamic: true })
        });

    message.reply({
        embeds: [embeds]
    });
}

module.exports = meTags;
