const { EmbedBuilder } = require('discord.js');

module.exports = {
    cooldown: 60000,
    name: 'StorySubmission',
    id: 'testModal',
    exec(cli, inter) {
        const title = inter.fields.getTextInputValue('titleInput');
        const story = inter.fields.getTextInputValue('storyInput');

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `Submission by ${inter.user.tag}`,
                iconURL: inter.user.displayAvatarURL({ dynamic: true })
            })
            .setColor(cli.color)
            .setTitle(title)
            .setDescription(story)
            .setFooter({
                text: cli.user.username,
                iconURL: cli.user.displayAvatarURL({ dynamic: true })
            });

        inter.reply({
            embeds: [embed]
        });
    }
};
