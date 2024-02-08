// Importing required package and define cooldown
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    Collection
} = require('discord.js');
const ms = require('pretty-ms');
const cd = new Collection();

// Define the context interaction module
async function ContextInteraction(inter, cli) {
    // Check if the interaction is a context menu interaction
    if (!inter.isContextMenuCommand()) return;
    const { member, channel } = inter;

    await channel.sendTyping();
    
    // Get the context command from the collection
    const context = await cli.contexts.get(inter.commandName);

    // Define cooldown id, developer lists and cooldown time left
    const cdId = `${member.id}:${context.data.name}`;
    const devList = cli.settings.devsID.map((dev) => `<@${dev}>`);
    const cdLeft = cd.has(cdId) ? cd.get(cdId) - Date.now() : null;

    // Get permissions and format it for the embeds
    const permsList = {
        bot: permsChecker(context).bot
            ? context.perms.bot.map().join(', ')
            : null
    };

    // Defining embeds and buttons
    const outdatedEmbed = new EmbedBuilder()
        .setColor(cli.color)
        .setTitle('Context Outdated!')
        .setDescription(
            `The Context Menu you're trying to use is outdated and may not work anymore.\nThis could happen if the bot got updated or an error occured, try to refresh your discord and if it still happened.\nPlease contact the devs immediately to get the issue fixed. Thank you`
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
            .setURL(cli.settings.supportServer)
    );
    const botPermissionEmbed = new EmbedBuilder()
        .setColor(cli.color)
        .setTitle('Missing Permissions!')
        .setDescription(
            `I don't have the required permissions to execute this context menu!`
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
            `The Context Menu you're trying to use is limited to Developer Only.`
        )
        .setFooter({
            text: cli.user.username,
            iconURL: cli.user.displayAvatarURL({ dynamic: true })
        });
    const cooldownEmbed = new EmbedBuilder()
        .setColor(cli.color)
        .setTitle('Context Menu is on Cooldown!')
        .setDescription(
            `The Context Menu you're trying to use is on cooldown. Please wait for a while before using it again!`
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

    // Check if the context menu exist on the collection
    if (!context) {
        return inter.reply({
            embeds: [outdatedEmbed],
            components: [linkButtons],
            ephemeral: true
        });
    }

    // Check if the bot have the necessary permissions
    if (
        permsChecker(context).bot &&
        !guild.members.me.permissions.has(
            PermissionsBitField.resolve(context.perms.bot || [])
        )
    )
        return inter.reply({
            embeds: [botPermissionEmbed],
            ephemeral: true
        });

    // Check if the command is restricted to developers only
    if (context.devOnly && !cli.settings.devsID.includes(inter.user.id)) {
        return inter.reply({
            embeds: [devsOnlyEmbed],
            ephemeral: true
        });
    }
    // Check if the command is on cooldown
    if (cd.has(cdId)) {
        return inter
            .reply({
                embeds: [cooldownEmbed],
                components: cdLeft >= 5000 ? [mentionButtons] : [], // Check if cooldown is above 5s and include mention buttons
                ephemeral: true
            })
            .then(async (msg) => {
                // Call the cooldown mention function
                cooldownMentionInteraction(
                    msg,
                    inter,
                    context,
                    mentionButtons,
                    cdLeft
                );
            });
    }

    try {
        // Execute the context menu
        await context.exec(cli, inter);

        // Check if the context menu have a cooldown
        if (!context.cooldown) return;

        // Set the cooldown and deletes it when over
        cd.set(cdId, Date.now() + context.cooldown);
        setTimeout(() => cd.delete(cdId), context.cooldown);
    } catch (error) {
        // Logs the error to the console
        console.error(error);

        const errorEmbed = new EmbedBuilder()
            .setColor(cli.color)
            .setTitle('An Error Occured!')
            .setDescription(
                `An error has occurred when executing this context menu. if the issue is Missing Permissions then try to put bot role hierarchy higher.\nif errors happened repeatedly on the same context menu, please contact devs immediately with the error reports down below to get the issue fixed!`
            )
            .addFields({ name: 'Error Report', value: `\`\`\`${error}\`\`\`` })
            .setFooter({
                text: cli.user.username,
                iconURL: cli.user.displayAvatarURL({ dynamic: true })
            });

        // Send the error embed to the user
        return inter.reply({
            embeds: [errorEmbed],
            components: [linkButtons],
            ephemeral: true
        });
    }
}

// Define cooldown mention function
function cooldownMentionInteraction(msg, inter, context, button, cd) {
    // Define filters for the user interact with it
    const filters = async (i) => {
        await i.deferUpdate();
        return i.customId == 'cd:mention' && i.user.id == inter.user.id;
    };
    // Define interaction and mention status
    let mention = false;
    let nestedInter;

    // Create single message components interaction with filters and 5 minutes timer
    msg.awaitMessageComponent({
        filter: filters,
        time: 1000 * 60 * 5
    }).then((i) => {
        nestedInter = i;
        button.components.forEach((c) => c.setDisabled(true)); // Disable all buttons when clicked
        mention = true; // Set mention status to true
        // Edit the message with the disabled components
        i.editReply({
            components: [button]
        });
    });

    // Create a timer to delete message after cooldown is over
    setTimeout(async () => {
        !msg ? null : msg.delete();
        // Check if mention status is true amd send mention message
        if (mention == true)
            await inter.channel.send(
                `${nestedInter.member} Your cooldown for \` ${context.name} \` context menu has ended!`
            );
    }, cd);
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
module.exports = ContextInteraction;
