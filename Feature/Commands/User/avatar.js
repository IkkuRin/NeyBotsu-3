const {
    EmbedBuilder,
    SlashCommandBuilder,
    ButtonBuilder,
    ActionRowBuilder
} = require('discord.js');

module.exports = {
    cooldown: 20000,
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Display users avatar')
        .addUserOption((opt) =>
            opt
                .setName('user')
                .setDescription('The user to get the avatar from')
        ),
    exec(cli, inter) {
        const user = inter.options.getUser('user') ?? inter.user;

        const avatar = asset(cli, user);

        return inter
            .reply({
                embeds: [avatar.embed],
                components: [avatar.button]
            })
            .then((msg) => {
                upscale(msg, cli, inter, user);
            });
    }
};

function upscale(msg, cli, inter, user) {
    const coll = msg.createMessageComponentCollector({
        filter: (i) => i.user.id === inter.user.id,
        time: 30000
    });

    coll.on('collect', async (i) => {
        const upscaled = asset(cli, user, 4096).embed;

        i.update({
            embeds: [upscaled],
            components: []
        });
    });

    coll.on('end', (c) => {
        if (c.size > 0) return;

        const disabled = asset(cli, user).button;
        disabled.components[0].setDisabled(true);

        msg.edit({
            components: [disabled]
        });
    });
}

function asset(cli, user, dim) {
    const withDim = { dynamic: true, size: dim ?? 512 };
    const avatar = user.displayAvatarURL(withDim);
    const embed = new EmbedBuilder()
        .setColor(cli.color)
        .setAuthor({
            name: user.username,
            iconURL: avatar
        })
        .setTitle(
            `${user.nickname || user.displayName || user.tag}'s Avatar ${dim > 1024 ? '(Upscaled)' : ''}`
        )
        .setDescription(`[Link](${avatar})`)
        .setImage(avatar)
        .setFooter({
            text: cli.user.username,
            iconURL: cli.user.displayAvatarURL({ dynamic: true })
        });
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('avatar:upscale')
            .setLabel('Upscale')
            .setStyle('Primary')
    );
    return {
        button: row,
        embed: embed
    };
}
