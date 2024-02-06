const {
    SlashCommandBuilder,
    ButtonBuilder,
    StringSelectMenuBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require('discord.js');

module.exports = {
    cooldown: 10000,
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('feature test')
        .addStringOption((opt) =>
            opt
                .setName('type')
                .setDescription('type of test')
                .setRequired(true)
                .addChoices(
                    { name: 'button', value: 'button' },
                    { name: 'modal', value: 'modal' },
                    { name: 'select menu', value: 'selectMenu' }
                )
        ),
    exec(cli, inter) {
        const { options } = inter;

        const opt = options.getString('type');

        switch (opt) {
            case 'button':
                button(inter);
                break;
            case 'modal':
                modal(inter);
                break;
            case 'selectMenu':
                selectmenu(inter);
                break;
        }
    }
};

function button(inter) {
    const agree = new ButtonBuilder()
        .setCustomId('testButton')
        .setLabel('Agree')
        .setStyle('Success');
    const disagree = new ButtonBuilder()
        .setCustomId('testButton2')
        .setLabel('Disagree')
        .setStyle('Danger');
    const row = new ActionRowBuilder().addComponents(agree, disagree);

    inter.reply({
        content: 'Do you agree with our TOS?',
        components: [row]
    });
}

async function modal(inter) {
    const modals = new ModalBuilder()
        .setCustomId('testModal')
        .setTitle('Stories Submission')
        .addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('titleInput')
                    .setLabel('Title')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('storyInput')
                    .setLabel('Story')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
            )
        );

    await inter.showModal(modals);
}

function selectmenu(inter) {
    const string = new StringSelectMenuBuilder()
        .setCustomId('testStringMenu')
        .setPlaceholder('Select a string')
        .addOptions(
            {
                label: 'String 1',
                description: 'String 1',
                value: 'string1'
            },
            {
                label: 'String 2',
                description: 'String 2',
                value: 'string2'
            },
            {
                label: 'String 3',
                description: 'String 3',
                value: 'string3'
            }
        );
    const row = new ActionRowBuilder().addComponents(string);

    inter.reply({
        content: 'menu',
        components: [row]
    });
}
