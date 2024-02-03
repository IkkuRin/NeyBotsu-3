const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    PermissionFlagsBits
} = require('discord.js');
const ms = require('pretty-ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a member.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption((opt) =>
            opt
                .setName('members')
                .setDescription('Input a member to timeout.')
                .setRequired(true)
        )
        .addNumberOption((opt) =>
            opt
                .setName('amount')
                .setDescription('Input a value for timeout. [1-60]')
                .setMinValue(1)
                .setMaxValue(60)
                .setRequired(true)
        )
        .addStringOption((opt) =>
            opt
                .setName('formats')
                .setDescription('Input a format for the timeout amount.')
                .setRequired(true)
                .addChoices(
                    { name: 'Seconds', value: 'secs' },
                    { name: 'Minutes', value: 'mins' },
                    { name: 'Hours', value: 'hours' },
                    { name: 'Days', value: 'days' }
                )
        )
        .addStringOption((opt) =>
            opt
                .setName('reasons')
                .setDescription('Input a reason for the timeout.')
        ),
    async exec(cli, inter) {
        const { options } = inter;

        const member = options.getMember('members');
        let amount = options.getNumber('amount');
        const format = options.getString('formats');
        let reason = options.getString('reasons');
        reason = reason ? ` with reason \` ${reason} \`` : '';

        switch (format) {
            case 'secs':
                amount = amount * 1000;
                break;
            case 'mins':
                amount = amount * 1000 * 60;
                break;
            case 'hours':
                amount = amount * 1000 * 60 * 60;
                break;
            case 'days':
                ampunt = amount * 1000 * 60 * 60 * 24;
                break;
        }

        const formattedTimer = ms(amount, { verbose: true });

        const confirmationEmbed = new EmbedBuilder()
            .setColor(cli.color)
            .setTitle('Timeout Commands')
            .setDescription(
                `Are you sure wants to Timeout ${member} for ${formattedTimer}${reason}?`
            )
            .setFooter({
                text: cli.user.username,
                iconURL: cli.user.displayAvatarURL({ dynamic: true })
            });
        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('timeout:confirm')
                .setLabel('Confirm')
                .setStyle('Danger'),
            new ButtonBuilder()
                .setCustomId('timeout:cancel')
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
                const coll = msg.createMessageComponentCollector({
                    idle: 10000
                });

                coll.on('collect', async (i) => {
                    if (i.custonId == 'timeout:confirm') {
                        const processEmbed = new EmbedBuilder()
                            .setColor(cli.color)
                            .setTitle('Timeout Commands')
                            .setDescription(`Timeouting ${member}...`)
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

                        await member.timeout(amount, reason);

                        const finishedEmbed = new EmbedBuilder()
                            .setColor(cli.color)
                            .setTitle('Timeout Commands')
                            .setDescription(
                                `${member} has been Timed Out for ${formattedTimer}${reason}!`
                            )
                            .setFooter({
                                text: 'You can close this message window now'
                            });

                        msg.edit({
                            embeds: [finishedEmbed],
                            components: []
                        });
                    } else if (i.customId == 'timeout:cancel') {
                        const cancelledEmbed = new EmbedBuilder()
                            .setColor(cli.color)
                            .setTitle('Timeout Commands')
                            .setDescription(
                                'No interaction recieved in the span of 10 seconds. Timeout Cancelled'
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

                coll.on('end', () => {
                    const msgC = inter.fetchReply();
                    if (!msg) return;
                    if (!msgC.components.length) return;

                    const noInterEmbed = new EmbedBuilder()
                        .setColor(cli.color)
                        .setTitle('Timeout Commands')
                        .setDescription(
                            'No interaction recieved in the span of 10 seconds. Timeout Cancelled'
                        )
                        .setFooter({
                            text: 'You can close this message window now'
                        });

                    msg.edit({
                        embeds: [noInterEmbed],
                        components: []
                    });
                });
            });
    }
};
