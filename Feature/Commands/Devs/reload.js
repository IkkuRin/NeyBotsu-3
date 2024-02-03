const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    devOnly: true,
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads The Events/Commands')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((opt) =>
            opt
                .setName('option')
                .setDescription(
                    'Choose Between Commands or Events to Reload. Leave Blank to Reload All'
                )
                .addChoices(
                    { name: 'Commands', value: 'cmd' },
                    { name: 'Events', value: 'evt' },
                    { name: 'Buttons', value: 'btn' }
                )
        ),
    exec(cli, inter) {
        const { options } = inter;

        const {
            commands,
            events,
            buttons
        } = require('../../../Structure/Handlers/allInOneHandler');

        const option = options.getString('option');

        const allEmbed = new EmbedBuilder()
            .setColor(cli.color)
            .setTitle('Reloaded!')
            .setDescription('Commands and Events has been reloaded')
            .setFooter({
                text: cli.user.username,
                iconURL: cli.user.displayAvatarURL({
                    size: 1024,
                    dynamic: true
                })
            });

        const eventsEmbed = new EmbedBuilder()
            .setColor(cli.color)
            .setTitle('Reloaded!')
            .setDescription('Events has been reloaded')
            .setFooter({
                text: cli.user.username,
                iconURL: cli.user.displayAvatarURL({
                    size: 1024,
                    dynamic: true
                })
            });

        const commandsEmbed = new EmbedBuilder()
            .setColor(cli.color)
            .setTitle('Reloaded!')
            .setDescription('Commands has been reloaded')
            .setFooter({
                text: cli.user.username,
                iconURL: cli.user.displayAvatarURL({
                    size: 1024,
                    dynamic: true
                })
            });

        const buttonsEmbed = new EmbedBuilder()
            .setColor(cli.color)
            .setTitle('Reloaded!')
            .setDescription('Bittons has been reloaded')
            .setFooter({
                text: cli.user.username,
                iconURL: cli.user.displayAvatarURL({
                    size: 1024,
                    dynamic: true
                })
            });

        switch (option) {
            case 'cmd':
                {
                    inter.reply({
                        embeds: [commandsEmbed],
                        ephemeral: true
                    });

                    commands(cli);
                }
                break;
            case 'btn':
                {
                    inter.reply({
                        embeds: [buttonsEmbed],
                        ephemeral: true
                    });

                    buttons(cli);
                }
                break;
            case 'evt':
                {
                    events(cli);

                    inter.reply({
                        embeds: [eventsEmbed],
                        ephemeral: true
                    });
                }
                break;
            default:
                {
                    events(cli);
                    commands(cli);
                    buttons(cli);

                    inter.reply({
                        embeds: [allEmbed],
                        ephemeral: true
                    });
                }
                break;
        }
    }
};
