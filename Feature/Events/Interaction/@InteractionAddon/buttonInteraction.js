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

// Define the button interaction function
async function ButtonInteraction(inter, cli) {
    // Check if the interaction is a button and the id is for local scope or not by checking for ':'
    if (!inter.isButton()) return;
    if (inter.customId.includes(':')) return;
    const { guild, member } = inter;

    // Get the button by id from the collection
    const button = await cli.buttons.get(inter.customId);

    // Define cooldown id, developer lists and cooldown time left
    const cdId = `${button.name}:${inter.user.id}`;
    const devList = cli.settings.devsID.map((dev) => `<@${dev}>`).join('\n');
    const cdLeft = cd.has(cdId) ? cd.get(cdId) - Date.now() : null;

    // Get permissions and format it for the embeds
    const permsList = {
        user: permsChecker(button).user
            ? button.perms.user.map().join(', ')
            : null,
        bot: permsChecker(button).bot ? button.perms.bot.map().join(', ') : null
    };

    // Defining embeds
    const outdatedEmbed = new EmbedBuilder()
        .setColor(cli.color)
        .setTitle('Buttons Outdated!')
        .setDescription(
            `The button you're trying to use is outdated and may not work anymore.\nThis could happen if the bot got updated or an error occured, try to re-set your button contained messages and if it still happened.\nPlease contact the devs immediately to get the issue fixed. Thank you`
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
    const userPermissionEmbed = new EmbedBuilder()
        .setColor(cli.color)
        .setTitle('Missing Permissions!')
        .setDescription(
            `You don't have the required permissions to use this buttons!`
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
            `I don't have the required permissions to execute this buttons!`
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
        .setTitle('Restricted Buttons!')
        .setDescription(
            `The button you're trying to use is limited to Developer Only.\nBut... how tf did you able to access the commands for this button??`
        )
        .setFooter({
            text: cli.user.username,
            iconURL: cli.user.displayAvatarURL({ dynamic: true })
        });
    const cooldownEmbed = new EmbedBuilder()
        .setColor(cli.color)
        .setTitle('Buttons is on Cooldown!')
        .setDescription(
            `The button you're trying to use is on cooldown. Please wait for a while before using it again!`
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

    // Check if the button exists in the collection
    if (!button)
        return inter.reply({
            embeds: [outdatedEmbed],
            components: [linkButtons],
            ephemeral: true
        });

    // Check if the user have the necessary permissions
    if (
        permsChecker(button).user &&
        !member.permissions.has(
            PermissionsBitField.resolve(button.perms.user || [])
        )
    )
        return inter.reply({
            embeds: [userPermissionEmbed],
            ephemeral: true
        });

    // Check if the bot have the necessary permissions
    if (
        permsChecker(button).bot &&
        !guild.members.me.permissions.has(
            PermissionsBitField.resolve(button.perms.bot || [])
        )
    )
        return inter.reply({
            embeds: [botPermissionEmbed],
            ephemeral: true
        });

    // Check if the command is restricted to developers only
    if (button.devOnly && !cli.settings.devsID.includes(inter.user.id))
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
                cooldownMentionInteraction(
                    msg,
                    inter,
                    button,
                    mentionButtons,
                    cdLeft
                );
            });

    try {
        // Execute the buttons
        await button.exec(cli, inter);

        // Checks if the buttons have cooldowns
        if (!button.cooldown) return;

        // Set the cooldown and deletes it when over
        cd.set(cdId, Date.now() + button.cooldown);
        setTimeout(() => cd.delete(cdId), button.cooldown);
    } catch (err) {
        // Logs the error to the console
        console.error(err);

        const errorEmbed = new EmbedBuilder()
            .setColor(cli.color)
            .setTitle('An Error Occured!')
            .setDescription(
                `An error has occurred when executing this button interaction.\nif this happened repeatedly on the same buttons, please contact devs immediately with the error reports down below to get the issue fixed!`
            )
            .addFields({ name: 'Error Report', value: `\`\`\`${err}\`\`\`` })
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

// Define cooldown mention function
function cooldownMentionInteraction(msg, inter, btn, button, cd) {
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
                `${nestedInter.member} Your cooldown for \` ${btn.name} \` buttons has ended!`
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
module.exports = ButtonInteraction;
