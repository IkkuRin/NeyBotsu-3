const {
    EmbedBuilder,
    SlashCommandBuilder,
    ButtonBuilder,
    ActionRowBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nickname')
        .setDescription('Change users nickname')
        .addStringOption((opt) =>
            opt
                .setName('nick')
                .setDescription('Input a new nickname')
                .setRequired(true)
        )
        .addUserOption((opt) =>
            opt.setName('user').setDescription('Change other users nickname')
        ),
    async exec(cli, inter) {
        const { options, member, user } = inter;

        const users = options.getMember('user') || member;
        const nick = {
            new: options.getString('nick') || user.username,
            old: users.nickname
        };

        const assets = asset(cli, users, nick);

        if (
            (member.id != users.id &&
                !member.permissions.has('ManageMember')) ||
            !users.moderatable
        )
            return inter.reply({ embeds: [assets.permsEmbed] });

        await users.setNickname(nick.new);

        inter
            .reply({
                embeds: [assets.embed],
                components: [assets.button]
            })
            .then((msg) => awaitUndo(msg, cli, member, users, nick));
    }
};

function asset(cli, users, nick) {
    const embed = new EmbedBuilder()
        .setColor(cli.color)
        .setTitle(`${users.user.username} Nickname Changed`)
        .setDescription(
            `Successfully changed ${users} nickname to \`${nick.new}\``
        )
        .setFooter({
            text: cli.user.username,
            iconURL: cli.user.displayAvatarURL({ dynamic: true })
        });

    const permsEmbed = new EmbedBuilder()
        .setColor(cli.color)
        .setTitle(`Missing Permissions`)
        .setDescription(
            `You dont have the permissions to change other users nickname!\nOr the user target has higher hierarchy than you or me!`
        )
        .setFooter({
            text: cli.user.username,
            iconURL: cli.user.displayAvatarURL({ dynamic: true })
        });

    const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('nick:undo')
            .setLabel('Undo')
            .setStyle('Danger')
    );

    const undoEmbed = new EmbedBuilder()
        .setColor(cli.color)
        .setTitle(`Undid ${users.user.username} nickname`)
        .setDescription(
            `Successfully revert ${users} nickname back to \`${nick.old}\``
        )
        .setFooter({
            text: cli.user.username,
            iconURL: cli.user.displayAvatarURL({ dynamic: true })
        });

    return {
        embed: embed,
        button: button,
        permsEmbed: permsEmbed,
        undoEmbed: undoEmbed
    };
}

function awaitUndo(msg, cli, member, users, nick) {
    const filters = (i) => i.user.id == member.id || i.user.id == users.id;

    const coll = msg.createMessageComponentCollector({
        filter: filters,
        time: 30000
    });

    coll.on('collect', async (i) => {
        const embed = asset(cli, users, nick).undoEmbed;

        await users.setNickname(nick.old);

        i.update({
            embeds: [embed],
            components: []
        });
    });

    coll.on('end', (c) => {
        if (c.size > 0) return;

        const disabled = asset.button;
        disabled.components[0].setDisabled(true);

        msg.edit({ components: [disabled] });
    });
}
