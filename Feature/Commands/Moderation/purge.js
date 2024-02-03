const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Purge messages on the channels')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addNumberOption((opt) =>
            opt
                .setName('amount')
                .setDescription('Type the amount of messages to delete')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
        )
        .addUserOption((opt) =>
            opt
                .setName('user')
                .setDescription('Purge messages from a specific user')
        ),
    async exec(cli, inter) {
        const { channel, options } = inter;

        const amount = options.getNumber('amount');
        const member = options.getMember('user');
        const messages = await channel.messages.fetch({ limit: amount });

        async function purge(messagefetch) {
            const responseMember = member
                ? `${amount} message${amount > 1 ? 's' : ''} from ${member} at ${channel}`
                : `${amount} message${amount > 1 ? 's' : ''} from ${channel}`;
            const responseEmbed = new EmbedBuilder()
                .setColor(cli.color)
                .setTitle('Purge Commands')
                .setDescription(
                    `Are you sure you want to purge ${responseMember}?`
                )
                .setFooter({
                    text: cli.user.username,
                    iconURl: cli.user.displayAvatarURL({
                        size: 1024,
                        dynamic: true
                    })
                });
            const buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('purge:confirm')
                    .setLabel('Confirm')
                    .setStyle('Danger'),
                new ButtonBuilder()
                    .setCustomId('purge:cancel')
                    .setLabel('Cancel')
                    .setStyle('Secondary')
            );

            inter
                .reply({
                    embeds: [responseEmbed],
                    components: [buttons],
                    ephemeral: true
                })
                .then((m) => {
                    const coll = m.createMessageComponentCollector({
                        idle: 10000
                    });

                    coll.on('collect', async (i) => {
                        if (i.customId == 'purge:confirm') {
                            const purgingEmbed = new EmbedBuilder()
                                .setColor(cli.color)
                                .setTitle('Purge Commands')
                                .setDescription(`Purging messages...`)
                                .setFooter({
                                    text: cli.user.username,
                                    iconURl: cli.user.displayAvatarURL({
                                        size: 1024,
                                        dynamic: true
                                    })
                                });

                            await i.update({
                                embeds: [purgingEmbed],
                                components: []
                            });

                            let deleted = await channel.bulkDelete(
                                messagefetch,
                                true
                            );

                            const aftermathMember = member
                                ? `${deleted.size} message${deleted.size > 1 ? 's' : ''} from ${member} at ${channel}`
                                : `${deleted.size} message${deleted.size > 1 ? 's' : ''} from ${channel}`;
                            const aftermathEmbed = new EmbedBuilder()
                                .setColor(cli.color)
                                .setTitle('Purge Commands')
                                .setDescription(`Purged ${aftermathMember}`)
                                .setFooter({
                                    text: 'You can close this message window now.'
                                });

                            m.edit({ embeds: [aftermathEmbed] });
                        } else if (i.customId == 'purge:cancel') {
                            const canceledEmbed = new EmbedBuilder()
                                .setColor(clo.color)
                                .setTitle('Purge Commands')
                                .setDescription(`Purge Cancelled.`)
                                .setFooter({
                                    text: 'You can close this message window now.'
                                });

                            i.update({
                                embeds: [canceledEmbed],
                                components: []
                            });
                        }
                    });

                    coll.on('end', () => {
                        if (!m) return;
                        if (!m.components) return;

                        const timeoutEmbed = new EmbedBuilder()
                            .setColor(cli.color)
                            .setTitle('Kick Commands')
                            .setDescription(
                                'No interaction received. kick cancelled'
                            )
                            .setFooter({
                                text: 'You can close this message window now.'
                            });

                        buttons.components.forEach((c) => c.setDisabled(true));

                        m.edit({
                            embeds: [timeoutEmbed],
                            components: [buttons]
                        });
                    });
                });
        }

        if (member) {
            const filtered = member
                ? messages.filter((m) => m.author.id == member.id)
                : null;

            purge(filtered);
        }

        purge(messages);
    }
};
