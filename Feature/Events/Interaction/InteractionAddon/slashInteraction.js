const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    Collection
} = require('discord.js');
const ms = require('pretty-ms');
const cd = new Collection();

async function SlashInteraction(inter, cli) {
    if (!inter.isChatInputCommand()) return;
    const { channel } = inter;

    const command = await cli.commands.get(inter.commandName);

    const cdId = `${command.data.name}:${inter.user.id}`;
    const devList = cli.settings.devsID.map((dev) => `<@${dev}>`).join('\n');
    const cdLeft = cd.has(cdId) ? cd.get(cdId) - Date.now() : null;

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

    if (!command)
        return inter.reply({
            embeds: [outdatedEmbed],
            components: [linkButtons],
            ephemeral: true
        });

    if (command.devOnly && !cli.settings.devsID.includes(inter.user.id))
        return inter.reply({
            embeds: [devsOnlyEmbed],
            ephemeral: true
        });

    if (cd.has(cdId))
        return inter
            .reply({
                embeds: [cooldownEmbed],
                components: cdLeft >= 5000 ? [mentionButtons] : [],
                ephemeral: true
            })
            .then(async (msg) => {
                const filters = async (i) => {
                    await i.deferUpdate();
                    return (
                        i.customId == 'cd:mention' && i.user.id == inter.user.id
                    );
                };
                let mention = false;
                let nestedInter;
                msg.awaitMessageComponent({
                    filter: filters,
                    time: 1000 * 60 * 5
                }).then((i) => {
                    nestedInter = i;
                    mentionButtons.components.forEach((c) =>
                        c.setDisabled(true)
                    );
                    mention = true;
                    i.editReply({
                        components: [mentionButtons]
                    });
                });

                setTimeout(async () => {
                    !msg ? null : msg.delete();
                    if (mention == true)
                        await channel.send(
                            `${nestedInter.member} Your cooldown for </${inter.commandName + ':' + inter.commandId}> has ended!`
                        );
                }, cdLeft);
            });

    try {
        await command.exec(cli, inter);

        if (!command.cooldown) return;

        cd.set(cdId, Date.now() + command.cooldown);
        setTimeout(() => cd.delete(cdId), command.cooldown);
    } catch (err) {
        console.log(err);

        const errorEmbed = new EmbedBuilder()
            .setColor(cli.color)
            .setTitle('An Error Occured!')
            .setDescription(
                `An error has occurred when executing this commands.
if this happened repeatedly on the same commands, please contact devs immediately with the error reports down below to get the issue fixed!`
            )
            .addFields({ name: 'Error Report', value: `\`\`\`${err}\`\`\`` })
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

        return inter.reply({
            embeds: [errorEmbed],
            components: [linkButtons],
            ephemeral: true
        });
    }
}

module.exports = SlashInteraction;
