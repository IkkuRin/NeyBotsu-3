const {
    EmbedBuilder,
    ContextMenuCommandBuilder,
    ApplicationCommandType
} = require('discord.js');

module.exports = {
    cooldown: 20000,
    data: new ContextMenuCommandBuilder()
        .setName('Avatar')
        .setType(ApplicationCommandType.User),
    exec(cli, inter) {
        const user = inter.targetUser;

        const embed = new EmbedBuilder()
            .setColor(cli.color)
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setTitle(
                `${user.nickname || user.displayName || user.tag}'s Avatar`
            )
            .setDescription(
                `[Link](${user.displayAvatarURL({ dynamic: true, size: 4096 })})`
            )
            .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setFooter({
                text: cli.user.username,
                iconURL: cli.user.displayAvatarURL({ dynamic: true })
            });

        return inter.reply({
            embeds: [embed]
        });
    }
};
