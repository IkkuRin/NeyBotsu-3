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
                    { name: 'Commands&Context', value: 'command' },
                    { name: 'Events', value: 'event' },
                    { name: 'Buttons', value: 'button' },
                    { name: 'Select Menus', value: 'selectMenu' },
                    { name: 'Modals', value: 'modal' }
                )
        ),
    exec(cli, inter) {
        const { options } = inter;

        const option = options.getString('option');

        reloads(cli, inter, option);
    }
};

async function reloads(cli, inter, option) {
    const {
        commands,
        events,
        buttons,
        selectMenus,
        modals
    } = require('../../../Structure/Handlers/allInOneHandler');

    let type = {
        title: 'Reloading The Bots',
        description: 'Bots has been reloaded'
    };
    if (option == 'command') {
        const types = 'Commands & Contexts';
        type = {
            title: `Reloading ${types}`,
            description: `All ${types} has been reloaded`
        };
        setTimeout(() => commands(cli), 500);
    }
    if (option == 'event') {
        const types = 'Events';
        type = {
            title: `Reloading ${types}`,
            description: `All ${types} has been reloaded`
        };
        for (const [key, value] of cli.events) {
            await cli.removeListener(`${key}`, value, true);
        }
        events(cli);
    }
    if (option == 'button') {
        const types = 'Buttons';
        type = {
            title: `Reloading ${types}`,
            description: `All ${types} has been reloaded`
        };
        buttons(cli);
    }
    if (option == 'selectMenu') {
        const types = 'Select Menu';
        type = {
            title: `Reloading ${types}`,
            description: `All ${types} has been reloaded`
        };
        selectMenus(cli);
    }
    if (option == 'modal') {
        const types = 'Modals';
        type = {
            title: `Reloading ${types}`,
            description: `All ${types} has been reloaded`
        };
        modals(cli);
    }
    if (!option) {
        for (const [key, value] of cli.events) {
            await cli.removeListener(`${key}`, value, true);
        }
        setTimeout(() => commands(cli), 1000);
        events(cli);
        buttons(cli);
        selectMenus(cli);
        modals(cli);
    }

    const embed = new EmbedBuilder(type).setColor(cli.color).setFooter({
        text: cli.user.username,
        iconURL: cli.user.displayAvatarURL({ dynamic: true })
    });

    inter.reply({
        embeds: [embed],
        ephemeral: true
    });
}
