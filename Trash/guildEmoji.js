const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guild-emoji')
        .setDescription('Get all emoji in this guild'),
    async exec(cli, inter) {
        const fetched = await inter.guild.emojis.fetch();

        const emojiList = fetched
            .map(
                (emoji) =>
                    `\`${emoji.name.slice(0, 1).toLowerCase() + emoji.name.slice(1, emoji.name.length)}: '<${emoji.name}:${emoji.id}>'\``
            )
            .join(',\n');

        inter.reply(emojiList);
    }
};
