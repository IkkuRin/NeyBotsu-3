// Importing required packages and define cooldowns
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    Collection
} = require('discord.js');
const ms = require('pretty-ms');
const cd = new Collection();

// Define slash interaction function
async function SlashInteraction(inter, cli) {
    // Checks if the interaction is a slash command
    if (!inter.isChatInputCommand()) return;

    await inter.channel.sendTyping();

    // Get commands from the collection
    const command = await cli.commands.get(inter.commandName);

    // Define cooldown id, developer lists and cooldown time left
    const cdId = `${command.data.name}:${inter.user.id}`;
    const devList = cli.settings.devsID.map((dev) => `<@${dev}>`).join('\n');
    const cdLeft = cd.has(cdId) ? cd.get(cdId) - Date.now() : null;

    // Get permissions and format it for the embeds
    const permsList = {
        bot: permsChecker(command).bot
            ? command.perms.bot.map().join(', ')
            : 'Target Has Higher Role Hierarchy'
    };

    // Embeds and Buttons Definition
    const outdatedEmbed = new EmbedBuilder()
        .setColor(cli.color)
        .setTitle('Commands Outdated!')
        .setDescription(
            `The commands you're trying to use is outdated and may not work anymore.\nThis could happen if the bot just got restarted or an error occured, try to refresh your discord and if it still happened.\nPlease contact the devs immediately to get the issue fixed. Thank you`
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
            `I don't have the required permissions to execute this command!`
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
        .setTitle('Restricted Commands!')
        .setDescription(
            `The commands you're trying to use is limited to Developer Only.`
        )
        .setFooter({
            text: cli.user.username,
            iconURL: cli.user.displayAvatarURL({ dynamic: true })
        });
    const cooldownEmbed = new EmbedBuilder()
        .setColor(cli.color)
        .setTitle('Commands is on Cooldown!')
        .setDescription(
            `The commands you're trying to use is on cooldown. Please wait for a while before using it again!`
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

    // Check if the commands exist on the collection
    if (!command)
        return inter.reply({
            embeds: [outdatedEmbed],
            components: [linkButtons],
            ephemeral: true
        });

    // Check if the bot have the necessary permissions
    if (
        permsChecker(command).bot &&
        !guild.members.me.permissions.has(
            PermissionsBitField.resolve(command.perms.bot || [])
        )
    )
        return inter.reply({
            embeds: [botPermissionEmbed],
            ephemeral: true
        });

    // Check if the command is restricted to developers only
    if (command.devOnly && !cli.settings.devsID.includes(inter.user.id))
        return inter.reply({
            embeds: [devsOnlyEmbed],
            ephemeral: true
        });

    // Check if the command is on cooldown
    if (cd.has(cdId))
        return inter
            .reply({
                embeds: [cooldownEmbed],
                components: cdLeft >= 5000 ? [mentionButtons] : [], // Check if cooldown is above 5s and include mention buttons
                ephemeral: true
            })
            .then(async (msg) => {
                // Call the cooldown mention function
                cooldownMentionInteraction(msg, inter, mentionButtons, cdLeft);
            });

    try {
        // Execute the commands
        await command.exec(cli, inter);

        // Check if the commands have a cooldown
        if (!command.cooldown) return;

        // Set the cooldown and deletes it when over
        cd.set(cdId, Date.now() + command.cooldown);
        setTimeout(() => cd.delete(cdId), command.cooldown);
    } catch (err) {
        // Logs the error to the console
        console.error(err);

        const errorEmbed = new EmbedBuilder()
            .setColor(cli.color)
            .setTitle('An Error Occured!')
            .setDescription(
                `An error has occurred when executing this commands. if the issue is Missing Permissions then try to put bot role hierarchy higher.\nif errors happened repeatedly on the same commands, please contact devs immediately with the error reports down below to get the issue fixed!`
            )
            .addFields({ name: 'Error Report', value: `\`\`\`${err}\`\`\`` })
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
function cooldownMentionInteraction(msg, inter, button, cd) {
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
                `${nestedInter.member} Your cooldown for </${inter.commandName}:${inter.commandId}> commands has ended!`
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
module.exports = SlashInteraction;
