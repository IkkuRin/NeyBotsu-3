const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member from the server')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption((opt) =>
            opt
                .setName('member')
                .setDescription('Input a member to kick')
                .setRequired(true)
        )
        .addStringOption((opt) =>
            opt.setName('reason').setDescription('Input a reason for the kick')
        ),
    async exec(cli, inter) {
        const { options } = inter;

        const member = options.getMember('member');
        const reason = options.getString('reason');
        const defReason = reason ? ` with reason \` ${reason} \`` : '';

        const confirmationEmbed = new EmbedBuilder()
            .setColor(cli.color)
            .setTitle(`Kick Commands`)
            .setDescription(
                `Are you sure wants to kick ${member} out from the server${defReason}?`
            )
            .setFooter({
                text: cli.user.username,
                iconURL: cli.user.displayAvatarURL({ dynamic: true })
            });

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('kick:confirm')
                .setLabel('Confirm')
                .setStyle('Danger'),
            new ButtonBuilder()
                .setCustomId('kick:cancel')
                .setLabel('Cancel')
                .setStyle('Secondary')
        );

        inter
            .reply({
                embeds: [confirmationEmbed],
                components: [buttons],
                ephemeral: true
            })
            .then((msg) => {
                const collector = msg.createMessageComponentCollector({
                    idle: 10000
                });

                collector.on('collect', async (i) => {
                    if (i.customId == 'kick:confirm') {
                        const processEmbed = new EmbedBuilder()
                            .setColor(cli.color)
                            .setTitle(`Kick Commands`)
                            .setDescription(`Kicking members...`)
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

                        await member.kick(reason);

                        const finishedEmbed = new EmbedBuilder()
                            .setColor(clo.color)
                            .setTitle(`Kick Commands`)
                            .setDescription(
                                `Successfully Kicked ${member} out from the server${defReason}.`
                            )
                            .setFooter({
                                text: 'You can close this message window now'
                            });

                        msg.edit({
                            embeds: [finishedEmbed],
                            components: []
                        });
                    } else if (i.customId == 'kick:cancel') {
                        const cancelledEmbed = new EmbedBuilder()
                            .setColor(cli.color)
                            .setTitle(`Kick Commands`)
                            .setDescription(
                                `Kicking ${member} has been cancelled.`
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

                    const cancelEmbed = new EmbedBuilder()
                        .setColor(cli.color)
                        .setTitle(`Kick Commands`)
                        .setDescription(
                            `No interaction received in the span of 10 seconds. Kick Canceled`
                        )
                        .setFooter({
                            text: 'You can close this message window now'
                        });

                    i.update({
                        embeds: [cancelEmbed],
                        components: []
                    });
                });
            });
    }
};
