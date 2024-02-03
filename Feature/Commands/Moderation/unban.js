const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    StringSelectMenuBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a member from the server')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async exec(cli, inter) {
        const { guild } = inter;
        var members;

        const fetchBan = await guild.bans.fetch({ limit: 25 });

        const noBanEmbed = new EmbedBuilder()
            .setColor(cli.color)
            .setTitle('Unban Commands')
            .setDescription(`No banned user detected on this server!`)
            .setFooter({
                text: cli.user.username,
                iconURL: cli.user.displayAvatarURL({ dynamic: true })
            });

        if (fetchBan.size == 0)
            return inter.reply({
                embeds: [noBanEmbed],
                components: [],
                ephemeral: true
            });

        const memberList = [];
        fetchBan.forEach((member) => {
            memberList.push({
                label: member.user.username,
                value: member.user.id
            });
        });

        const choicesEmbed = new EmbedBuilder()
            .setColor(cli.color)
            .setTitle('Unban Commands')
            .setDescription(
                'Choose a member to unban from drop-down menu below'
            )
            .setFooter({
                text: cli.user.username,
                iconURL: cli.user.displayAvatarURL({ dynamic: true })
            });

        const selectMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('unban:selectMenu')
                .setPlaceholder('Select a user')
                .addOptions(memberList)
                .setMinValues(1)
                .setMaxValues(1)
        );

        inter
            .reply({
                embeds: [choicesEmbed],
                components: [selectMenu],
                ephemeral: true
            })
            .then((msg) => {
                const collector = msg.createMessageComponentCollector({
                    idle: 10000
                });

                collector.on('collect', async (i) => {
                    if (
                        i.isStringSelectMenu() &&
                        i.customId == 'unban:selectMenu'
                    ) {
                        members = await cli.users.fetch(i.values[0]);

                        const confirmationEmbed = new EmbedBuilder()
                            .setColor(cli.color)
                            .setTitle('Unban Commands')
                            .setDescription(
                                `Are you sure wanted to Unban ${members}?`
                            )
                            .setFooter({
                                text: cli.user.username,
                                iconURL: cli.user.displayAvatarURL({
                                    dynamic: true
                                })
                            });

                        const buttons = new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId('unban:confirm')
                                .setLabel('Confirm')
                                .setStyle('Danger'),
                            new ButtonBuilder()
                                .setCustomId('unban:cancel')
                                .setLabel('Cancel')
                                .setStyle('Secondary')
                        );

                        await i.update({
                            embeds: [confirmationEmbed],
                            components: [buttons]
                        });
                    } else if (i.isButton() && i.customId == 'unban:confirm') {
                        const processEmbed = new EmbedBuilder()
                            .setColor(cli.color)
                            .setTitle('Unban Commands')
                            .setDescription(`Unbanning status...`)
                            .setFooter({
                                text: cli.user.username,
                                iconURL: cli.user.displayAvatarURL({
                                    dynamic: true
                                })
                            });

                        await i.update({
                            embeds: [processEmbed],
                            components: []
                        });

                        await guild.members.unban(members.id);

                        const finishedEmbed = new EmbedBuilder()
                            .setColor(cli.color)
                            .setTitle('Unban Commands')
                            .setDescription(`${members} has been Unbanned!`)
                            .setFooter({
                                text: 'You can close this message window now'
                            });

                        msg.edit({
                            embeds: [finishedEmbed],
                            components: []
                        });
                    } else if (i.isButton() && i.customId == 'unban:cancel') {
                        const cancelledEmbed = new EmbedBuilder()
                            .setColor(cli.color)
                            .setTitle('Unban Commands')
                            .setDescription(
                                `Unbanning ${members} has been Cancelled.`
                            )
                            .setFooter({
                                text: 'You can close this message window now'
                            });

                        i.update({
                            embeds: [cancelledEmbed],
                            components: []
                        });
                    }
                });

                collector.on('end', async () => {
                    const msgC = await inter.fetchReply();
                    if (!msg) return;
                    if (!msgC.components.length) return;

                    const noInteractionEmbed = new EmbedBuilder()
                        .setColor(cli.color)
                        .setTitle('Unban Commands')
                        .setDescription(
                            `No interaction received in the span of 10 seconds. Unban Cancelled!`
                        )
                        .setFooter({
                            text: 'You can close this message window now'
                        });

                    switch (true) {
                        case msgC.components[0].components.type ==
                            'StringSelectMenu':
                    }

                    msg.edit({
                        embeds: [noInteractionEmbed],
                        components: []
                    });
                });
            });
    }
};
