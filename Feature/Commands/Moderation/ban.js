const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member out from the server')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption((opt) =>
            opt
                .setName('member')
                .setDescription('Input a members to ban!')
                .setRequired(true)
        )
        .addNumberOption((opt) =>
            opt
                .setName('delete-message')
                .setDescription(
                    '[optional] Deletes message from the members on how many days'
                )
                .setMinValue(1)
                .setMaxValue(7)
        )
        .addStringOption((opt) =>
            opt
                .setName('reason')
                .setDescription('[optional] Input a reason for the ban')
        ),
    async exec(cli, inter) {
        const { options } = inter;

        const member = options.getMember('member');
        const deleteMessage =
            options.getNumber('delete-message') * 60 * 60 * 24;
        const reason = options.getString('reason');

        async function ban(members, delMsg, reasons) {
            reasons = reasons ? ` with reasons \` ${reasons} \`` : '';
            const delM = delMsg
                ? ` and delete the message sent by the user within ${delMsg / 60 / 60 / 24} days`
                : '';
            const responseEmbed = new EmbedBuilder()
                .setColor(cli.color)
                .setTitle('Ban Commands')
                .setDescription(
                    `Are you sure you want to banned ${members} from the server${reasons}${delM}?`
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
                    .setCustomId('ban:confirm')
                    .setLabel('Confirm')
                    .setStyle('Danger'),
                new ButtonBuilder()
                    .setCustomId('ban:cancel')
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
                        if (i.customId == 'ban:confirm') {
                            const banningEmbed = new EmbedBuilder()
                                .setColor(cli.color)
                                .setTitle('Ban Commands')
                                .setDescription(`Banning Member...`)
                                .setFooter({
                                    text: cli.user.username,
                                    iconURl: cli.user.displayAvatarURL({
                                        size: 1024,
                                        dynamic: true
                                    })
                                });

                            await i.update({
                                embeds: [banningEmbed],
                                components: []
                            });

                            await members.ban({
                                deleteMessageSeconds: delMsg,
                                reason: reasons
                            });

                            const aftermathEmbed = new EmbedBuilder()
                                .setColor(cli.color)
                                .setTitle('Ban Commands')
                                .setDescription(
                                    `Banned ${members} from the server${reasons}${delM}`
                                )
                                .setFooter({
                                    text: 'You can close this message window now.'
                                });

                            m.edit({ embeds: [aftermathEmbed] });
                        } else if (i.customId == 'ban:cancel') {
                            const canceledEmbed = new EmbedBuilder()
                                .setColor(cli.color)
                                .setTitle('Ban Commands')
                                .setDescription(`Banning Cancelled.`)
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
                            .setTitle('Ban Commands')
                            .setDescription(
                                'No interaction received. ban cancelled'
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

        ban(member, deleteMessage, reason);
    }
};
