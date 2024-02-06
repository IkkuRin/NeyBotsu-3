// Importing the required packages and defining cooldowns
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    PermissionsBitField,
    Collection
} = require('discord.js');
const ms = require('pretty-ms');
const cd = new Collection();

// Defining select menu interaction
async function SelectMenuInteraction(inter, cli) {
    // Check if the interaction is a select menu and if the id is local by checking if the id includes ':'
    if (!inter.isAnySelectMenu()) return;
    if (inter.customId.includes(':')) return;
    const { guild, member } = inter;

    // Get select menu by id from the collection
    const menu = cli.selectMenus.get(inter.customId);

    // Defining cooldown id, developer lists and cooldown time left
    const cdId = `${member.id}:${inter.customId}`;
    const devList = cli.settings.devsID.map((dev) => `<@${dev}>`);
    const cdLeft = cd.has(cdId) ? cd.get(cdId) - Date.now() : null;

    // Get permissions and format it for the embeds
    const permsList = {
        user: permsChecker(menu).user ? menu.perms.user.join(', ') : null,
        bot: permsChecker(menu).bot ? menu.perms.bot.join(', ') : null
    };

    // Defining embeds and buttons
    const outdatedEmbed = new EmbedBuilder()
        .setColor(cli.color)
        .setTitle('Select Menu Outdated!')
        .setDescription(
            `The Select Menu you're trying to use is outdated and may not work anymore.\nThis could happen if the bot got updated or an error occured, try to re-set your select menu contained messages and if it still happened.\nPlease contact the devs immediately to get the issue fixed. Thank you`
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
    const userPermissionEmbed = new EmbedBuilder()
        .setColor(cli.color)
        .setTitle('Missing Permissions!')
        .setDescription(
            `You don't have the required permissions to use this Select Menu!`
        )
        .addFields({
            name: 'Required Permissions',
            value: `\` ${permsList.user} \``
        })
        .setFooter({
            text: cli.user.username,
            iconURL: cli.user.displayAvatarURL({ dynamic: true })
        });
    const botPermissionEmbed = new EmbedBuilder()
        .setColor(cli.color)
        .setTitle('Missing Permissions!')
        .setDescription(
            `I don't have the required permissions to execute this Select Menu!`
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
        .setTitle('Restricted Menu!')
        .setDescription(
            `The Select Menu you're trying to use is limited to Developer Only.\nBut... how tf did you able to access the commands for this menu??`
        )
        .setFooter({
            text: cli.user.username,
            iconURL: cli.user.displayAvatarURL({ dynamic: true })
        });
    const cooldownEmbed = new EmbedBuilder()
        .setColor(cli.color)
        .setTitle('Select Menu is on Cooldown!')
        .setDescription(
            `The Select Menu you're trying to use is on cooldown. Please wait for a while before using it again!`
        )
        .addFields({
            name: 'Cooldown ends in',
            value: `\` ${cdLeft ? ms(cdLeft, { compact: true }) : null} \``
        })
        .setFooter({
            text: cli.user.username,
            iconURL: cli.user.displayAvatarURL({ dynamic: true })
        });
    const mentionButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('cd:mention')
            .setLabel('Mention when finished?')
            .setStyle('Secondary')
            .setEmoji('🔔')
    );

    // Check if select menu exists in the collection
    if (!menu) {
        return inter.reply({
            embeds: [outdatedEmbed],
            components: [linkButtons],
            ephemeral: true
        });
    }

    // Check if the user have the necessary permissions
    if (
        permsChecker(menu).user &&
        !member.permissions.has(
            PermissionsBitField.resolve(menu.perms.user || [])
        )
    ) {
        return inter.reply({
            embeds: [userPermissionEmbed],
            ephemeral: true
        });
    }

    // Check if the bot have the necessary permissions
    if (
        permsChecker(menu).bot &&
        !guild.members.me.permissions.has(
            PermissionsBitField.resolve(menu.perms.bot || [])
        )
    ) {
        return inter.reply({
            embeds: [botPermissionEmbed],
            ephemeral: true
        });
    }

    // Check if the select menu is restricted to developers only
    if (menu.devOnly && !cli.settings.devsID.includes(inter.user.id)) {
        return inter.reply({
            embeds: [devsOnlyEmbed],
            ephemeral: true
        });
    }

    // Check if the select menu is on cooldown
    if (cd.has(cdId)) {
        return inter.reply({
            embeds: [cooldownEmbed],
            components: cdLeft >= 5000 ? [mentionButtons] : [], // Check if cooldown is above 5s and include mention buttons
            ephemeral: true
        });
    }

    try {
        // Execute the select menu
        await menu.exec(cli, inter);

        // Checks if the select menu have cooldowns
        if (!menu.cooldown) return;

        // Set the cooldown and deletes it when over
        cd.set(cdId, Date.now() + menu.cooldown);
        setTimeout(() => cd.delete(cdId), menu.cooldown);
    } catch (error) {
        // Logs the errors to the console
        console.error(error);

        const errorEmbed = new EmbedBuilder()
            .setColor(cli.color)
            .setTitle('An Error Occured!')
            .setDescription(
                `An error has occurred when executing this select menu interaction.\nif this happened repeatedly on the same select menu, please contact devs immediately with the error reports down below to get the`
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

module.exports = SelectMenuInteraction;
