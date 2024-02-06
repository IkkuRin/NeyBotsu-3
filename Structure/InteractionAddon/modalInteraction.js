// Importing the required packages and defining cooldowns
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    Collection
} = require('discord.js');
const ms = require('pretty-ms');
const cd = new Collection();

// Define modal interaction function
async function ModalInteraction(inter, cli) {
    // Check if the interaction is a modal and if the id is local or not by checking if its include ':'
    if (!inter.isModalSubmit()) return;
    if (inter.customId.includes(':')) return;
    const { member } = inter;

    // Get the modal from the collection by custom id
    const modal = cli.modals.get(inter.customId);

    // Define cooldown id, developer lists and cooldown time left
    const cdId = `${member.id}:${inter.customId}`;
    const devList = cli.settings.devsID.map((dev) => `<@${dev}>`);
    const cdLeft = cd.has(cdId) ? cd.get(cdId) - Date.now() : null;

    // Get permissions and format it for the embeds
    const permsList = {
        bot: permsChecker(modal).bot ? modal.perms.bot.map().join(', ') : null
    };

    // Embeds definition
    const outdatedEmbed = new EmbedBuilder()
        .setColor(cli.color)
        .setTitle('Modal Outdated!')
        .setDescription(
            `The Modal you're trying to use is outdated and may not work anymore.\nThis could happen if the bot got updated or an error occured, try to re-set your modal contained messages and if it still happened.\nPlease contact the devs immediately to get the issue fixed. Thank you`
        )
        .addFields({ name: 'Developer', value: `${devList}` })
        .setFooter({
            text: cli.user.username,
            iconURL: cli.user.displayAvatarURL({ dynamic: true })
        });
    const linkButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel('Support Server')
            .setStyle('Link')
            .setEmoji('🌐')
            .setURL('https://discord.gg/qsayBrASr8')
    );
    const botPermissionEmbed = new EmbedBuilder()
        .setColor(cli.color)
        .setTitle('Missing Permissions!')
        .setDescription(
            `I don't have the required permissions to execute this modal!`
        )
        .addFields({
            name: 'Required Permissions',
            value: `\` ${permsList.bot} \``
        })
        .setFooter({
            text: cli.user.username,
            iconURL: cli.user.displayAvatarURL({ dynamic: true })
        });
    const devsOnlyEmbed = new EmbedBuilder()
        .setColor(cli.color)
        .setTitle('Restricted Modals!')
        .setDescription(
            `The Modal you're trying to use is limited to Developer Only.\nBut... how tf did you able to access the commands for this modal??`
        )
        .setFooter({
            text: cli.user.username,
            iconURL: cli.user.displayAvatarURL({ dynamic: true })
        });
    const cooldownEmbed = new EmbedBuilder()
        .setColor(cli.color)
        .setTitle('Modal is on Cooldown!')
        .setDescription(
            `The Modal you're trying to use is on cooldown. Please wait for a while before using it again!`
        )
        .addFields({
            name: 'Cooldown ends in',
            value: `\` ${cdLeft ? ms(cdLeft, { compact: true }) : null} \``
        })
        .setFooter({
            text: cli.user.username,
            iconURL: cli.user.displayAvatarURL({ dynamic: true })
        });

    // Check if the modal exists in the collection
    if (!modal) {
        return inter.reply({
            embeds: [outdatedEmbed],
            components: [linkButtons],
            ephemeral: true
        });
    }

    // Check if the bot have the necessary permissions
    if (
        permsChecker(modal).bot &&
        !guild.members.me.permissions.has(
            PermissionsBitField.resolve(modal.perms.bot || [])
        )
    )
        return inter.reply({
            embeds: [botPermissionEmbed],
            ephemeral: true
        });

    // Check if the command is restricted to developers only
    if (modal.devOnly && !cli.settings.devsID.includes(inter.user.id)) {
        return inter.reply({
            embeds: [devsOnlyEmbed],
            ephemeral: true
        });
    }

    // Check if the command is on cooldown
    if (cd.has(cdId)) {
        return inter.reply({
            embeds: [cooldownEmbed],
            ephemeral: true
        });
    }

    try {
        // Execute the modals
        await modal.exec(cli, inter);

        // Check if the modal has cooldown
        if (!modal.cooldown) return;

        // Set the cooldown and deletes it when over
        cd.set(cdId, Date.now() + modal.cooldown);
        setTimeout(() => cd.delete(cdId), modal.cooldown);
    } catch (error) {
        // Logs the error to the console
        console.error(error);

        const errorEmbed = new EmbedBuilder()
            .setColor(cli.color)
            .setTitle('An Error Occured!')
            .setDescription(
                `An error has occurred when executing this modal interaction.\nif this happened repeatedly on the same modal, please contact devs immediately with the error reports down below to get the`
            )
            .addFields({ name: 'Error Report', value: `\`\`\`${error}\`\`\`` })
            .setFooter({
                text: cli.user.username,
                iconURL: cli.user.displayAvatarURL({ dynamic: true })
            });

        // Send the error embeds to the user
        return inter.reply({
            embeds: [errorEmbed],
            components: [linkButtons],
            ephemeral: true
        });
    }
}

// Function to check if the buttons have specific required permissions
function permsChecker(coll) {
    let user;
    let bot;
    if (coll.perms) {
        coll.perms.user ? (user = coll.perms.user) : null;
        coll.perms.bot ? (bot = coll.perms.bot) : null;
    }
    return { user: user, bot: bot };
}

// Exports module
module.exports = ModalInteraction;
