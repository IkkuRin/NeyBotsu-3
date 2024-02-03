const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('move-channel')
        .setDescription('Moves a Channels Position or to another Category!')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addChannelOption((opt) =>
            opt
                .setName('channel')
                .setDescription('The Channel you want to move!')
                .setRequired(true)
        )
        .addChannelOption((opt) =>
            opt
                .setName('category')
                .setDescription(
                    'Change channel category! (choose the same category for just changing position)'
                )
                .addChannelTypes(4)
                .setRequired(true)
        )
        .addNumberOption((opt) =>
            opt
                .setName('position')
                .setDescription('Change the position of the channel!')
                .setMinValue(1)
                .setMaxValue(50)
        ),
    exec(cli, inter) {
        const { options } = inter;
        const channel = options.getChannel('channel');
        const category = options.getChannel('category');
        let position = options.getNumber('position');

        cateChild = category.children.cache.size;
        position = position >= cateChild ? cateChild : position;

        const failEmbed = new EmbedBuilder()
            .setColor(cli.color)
            .setTitle('Failed to Move Channels!')
            .setFooter({
                text: cli.user.username,
                iconURL: cli.user.displayAvatarURL({
                    size: 1024,
                    dynamic: true
                })
            });

        switch (true) {
            case channel.type != 2 && channel.type != 0:
                {
                    failEmbed.setDescription(
                        `Failed to move ${channel}!\n**Reason:**\n\`\`\`Channel Types must be either Text or a Voice Channels!\`\`\``
                    );

                    return inter.reply({
                        embeds: [failEmbed],
                        ephemeral: true
                    });
                }
                break;
            case channel.parent.id === category.id:
                {
                    const positionEmbed = new EmbedBuilder()
                        .setColor(cli.color)
                        .setTitle('Channel Moved!')
                        .setDescription(
                            'Channel position successfully changed!'
                        )
                        .addFields(
                            {
                                name: 'Channels',
                                value: `${channel}`,
                                inline: true
                            },
                            {
                                name: 'Position',
                                value: `\` ${position} \``,
                                inline: true
                            }
                        )
                        .setFooter({
                            text: cli.user.username,
                            iconURL: cli.user.displayAvatarURL({
                                size: 1024,
                                dynamic: true
                            })
                        });

                    channel
                        .setPosition(position - 1)
                        .then(() =>
                            inter.reply({
                                embeds: [positionEmbed],
                                ephemeral: true
                            })
                        )
                        .catch((e) => {
                            inter.reply({
                                embeds: [
                                    failEmbed.setDescription(
                                        `Failed to move ${channel} to position \` ${position} \`\n**Reason:**\n\`\`\`${e}\`\`\``
                                    )
                                ],
                                ephemeral: true
                            });
                            return console.log(e);
                        });
                }
                break;
            case !position:
                {
                    const categoryEmbed = new EmbedBuilder()
                        .setColor(cli.color)
                        .setTitle('Channel Moved!')
                        .setDescription(
                            'Channel parent category successfully changed!'
                        )
                        .addFields(
                            {
                                name: 'Channels',
                                value: `${channel}`,
                                inline: true
                            },
                            {
                                name: 'Category',
                                value: `${category}`,
                                inline: true
                            }
                        )
                        .setFooter({
                            text: cli.user.username,
                            iconURL: cli.user.displayAvatarURL({
                                size: 1024,
                                dynamic: true
                            })
                        });

                    channel
                        .setParent(category)
                        .then(() =>
                            inter.reply({
                                embeds: [categoryEmbed],
                                ephemeral: true
                            })
                        )
                        .catch((e) => {
                            inter.reply({
                                embeds: [
                                    failEmbed.setDescription(
                                        `Failed to move ${channel} to ${category}\n**Reason:**\n\`\`\`${e}\`\`\``
                                    )
                                ],
                                ephemeral: true
                            });
                            return console.log(e);
                        });
                }
                break;
            default:
                {
                    const bothEmbed = new EmbedBuilder()
                        .setColor(cli.color)
                        .setTitle('Channel Moved!')
                        .setDescription(
                            'Channel position and parent category have successfully changed!'
                        )
                        .addFields(
                            {
                                name: 'Channels',
                                value: `${channel}`
                            },
                            {
                                name: 'Category',
                                value: `${category}`
                            },
                            {
                                name: 'Position',
                                value: `\` ${position} \``
                            }
                        )
                        .setFooter({
                            text: cli.user.username,
                            iconURL: cli.user.displayAvatarURL({
                                size: 1024,
                                dynamic: true
                            })
                        });

                    channel
                        .edit({
                            parent: category,
                            position: position - 1
                        })
                        .then(() =>
                            inter.reply({
                                embeds: [bothEmbed],
                                ephemeral: true
                            })
                        )
                        .catch((e) => {
                            inter.reply({
                                embeds: [
                                    failEmbed.setDescription(
                                        `Failed to move ${channel} to ${category} with \` ${position} \` position.\n**Reason:**\n\`\`\`${e}\`\`\``
                                    )
                                ],
                                ephemeral: true
                            });
                            return console.log(e);
                        });
                }
                break;
        }
    }
};
