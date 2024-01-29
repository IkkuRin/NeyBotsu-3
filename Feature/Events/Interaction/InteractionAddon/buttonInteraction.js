const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  PermissionsBitField,
  Collection,
} = require("discord.js");
const ms = require("pretty-ms");
const cd = new Collection();

async function ButtonInteraction(inter, cli) {
  if (!inter.isButton()) return;
  if (inter.customId.includes(":")) return;
  const { channel, guild, member } = inter;

  const button = await cli.buttons.get(inter.customId);

  const cdId = `${button.name}:${inter.user.id}`;
  const devList = cli.settings.devsID.map((dev) => `<@${dev}>`).join("\n");
  const cdLeft = cd.has(cdId) ? Date.now() - cd.get(cdId) : null;
  const permsList = {
    user: button.perms.user ? button.perms.user.map().join(", ") : null,
    bot: button.perms.bot ? button.perms.bot.map().join(", ") : null,
  };

  const outdatedEmbed = new EmbedBuilder()
    .setColor(cli.color)
    .setTitle("Buttons Outdated!")
    .setDescription(
      `The butyon you're trying to use is outdated and may not work anymore.\nThis could happen if the bot got updated or an error occured, try to re-set your button contained messages and if it still happened.\nPlease contact the devs immediately to get the issue fixed. Thank you`,
    )
    .addFields({ name: "Developer", value: `${devList}` })
    .setFooter({
      text: cli.user.username,
      iconURL: cli.user.displayAvatarURL({ dynamic: true }),
    });
  const linkButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("Support Server")
      .setStyle("Link")
      .setEmoji("🌐")
      .setURL("https://discord.gg/qsayBrASr8"),
  );

  const userPermissionEmbed = new EmbedBuilder()
    .setColor(cli.color)
    .setTitle("Missing Permissions!")
    .setDescription(
      `You don't have the required permissions to use this buttons!`,
    )
    .addFields({
      name: "Required Permissions",
      value: `\` ${permsList.user} \``,
    })
    .setFooter({
      text: cli.user.username,
      iconURL: cli.user.displayAvatarURL({ dynamic: true }),
    });

  const botPermissionEmbed = new EmbedBuilder()
    .setColor(cli.color)
    .setTitle("Missing Permissions!")
    .setDescription(
      `I don't have the required permissions to execute this buttons!`,
    )
    .addFields({
      name: "Required Permissions",
      value: `\` ${permsList.bot} \``,
    })
    .setFooter({
      text: cli.user.username,
      iconURL: cli.user.displayAvatarURL({ dynamic: true }),
    });

  const devsOnlyEmbed = new EmbedBuilder()
    .setColor(cli.color)
    .setTitle("Restricted Buttons!")
    .setDescription(
      `The button you're trying to use is limited to Developer Only.\nBut... how tf did you able to access the commands for this button??`,
    )
    .setFooter({
      text: cli.user.username,
      iconURL: cli.user.displayAvatarURL({ dynamic: true }),
    });

  const cooldownEmbed = new EmbedBuilder()
    .setColor(cli.color)
    .setTitle("Buttons is on Cooldown!")
    .setDescription(
      `The button you're trying to use is on cooldown. Please wait for a while before using it again!`,
    )
    .addFields({
      name: "Cooldown ends in",
      value: `\` ${ms(cdLeft, { compact: true })} \``,
    })
    .setFooter({
      text: cli.user.username,
      iconURL: cli.user.displayAvatarURL({ dynamic: true }),
    });
  const mentionButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("cd:mention")
      .setLabel("Mention when finished?")
      .setStyle("Secondary")
      .setEmoji("🔔"),
  );

  if (!button)
    return inter.reply({
      embeds: [outdatedEmbed],
      components: [linkButtons],
      ephemeral: true,
    });

  if (
    button.perms.user &&
    !member.permissions.has(
      PermissionsBitField.resolve(button.perms.user || []),
    )
  )
    return inter.reply({
      embeds: [userPermissionEmbed],
      ephemeral: true,
    });

  if (
    button.perms.bot &&
    !guild.members.me.permissions.has(
      PermissionsBitField.resolve(button.perms.bot || []),
    )
  )
    return inter.reply({
      embeds: [botPermissionEmbed],
      ephemeral: true,
    });

  if (button.devOnly && !cli.settings.devsID.includes(inter.user.id))
    return inter.reply({
      embeds: [devsOnlyEmbed],
      ephemeral: true,
    });

  if (cd.has(cdId))
    return inter
      .reply({
        embeds: [cooldownEmbed],
        components: cdLeft >= 5000 ? [mentionButtons] : [],
        ephemeral: true,
      })
      .then(async (msg) => {
        const filters = async i => {
          await i.deferUpdate();
          return i.customId == "cd:mention" && i.user.id == inter.user.id
        };
        let mention = false;
        let nestedInter;
        msg.awaitMessageComponent({
          filter: filters,
          time: 1000 * 60 * 5
        }).then(i => {
          nestedInter = i;
          mentionButtons.components.forEach((c) => c.setDisabled(true));
          mention = true;
          i.editReply({
            components: [mentionButtons],
          });
        });

        setTimeout(async () => {
          !msg ? null : msg.delete();
          if (mention == true)
            await channel.send(
              `${nestedInter.member} Your cooldown for **${inter.label}** has ended!`,
            );
        }, cdLeft);
      });

  try {
    await button.exec(cli, inter);

    if (!button.cooldown) return;

    cd.set(cdId, Date.now() + button.cooldown);
    setTimeout(() => cd.delete(cdId), button.cooldown);
  } catch (err) {
    console.log(err);

    const errorEmbed = new EmbedBuilder()
      .setColor(cli.color)
      .setTitle("An Error Occured!")
      .setDescription(
        `An error has occurred when executing this button interaction.
if this happened repeatedly on the same buttons, please contact devs immediately with the error reports down below to get the issue fixed!`,
      )
      .addFields({ name: "Error Report", value: `\`\`\`${err}\`\`\`` })
      .setFooter({
        text: cli.user.username,
        iconURL: cli.user.displayAvatarURL({ dynamic: true }),
      });
    const linkButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Support Server")
        .setStyle("Link")
        .setEmoji("🌐")
        .setURL("https://discord.gg/qsayBrASr8"),
    );

    return inter.reply({
      embeds: [errorEmbed],
      components: [linkButtons],
      ephemeral: true,
    });
  }
}

module.exports = { name: "ButtonAddon", ButtonInteraction };
