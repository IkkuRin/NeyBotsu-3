const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const ms = require("pretty-ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("un-timeout")
    .setDescription("Remove timeout from a member")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMembers)
    .addUserOption((opt) =>
      opt
        .setName("member")
        .setDescription("Input a members to remove its timeout!")
        .setRequired(true),
    ),
  async exec(cli, inter) {
    const { options } = inter;

    const member = options.getMember("member");

    const noTimeoutEmbed = new EmbedBuilder()
      .setColor(cli.color)
      .setTitle("Un-Timeout Commands")
      .setDescription("This member is not timeouted.")
      .setFooter({
        text: cli.user.username,
        iconURL: cli.user.displayAvatarURL({ dynamic: true }),
      });

    if (!member.communicationDisabledUntil)
      return inter.reply({
        embeds: [noTimeoutEmbed],
        components: [],
        ephemeral: true,
      });

    const timeLeft = ms(
      member.communicationDisabledUntilTimestamp - Date.now(),
      { verbose: true },
    );

    const confirmationEmbed = new EmbedBuilder()
      .setColor(cli.color)
      .setTitle("Un-Timeout Commands")
      .setDescription(
        `${member} still have timeout for ${timeLeft}. Are you sure wants to un-timeout?`,
      )
      .setFooter({
        text: cli.user.username,
        iconURL: cli.user.displayAvatarURL({ dynamic: true }),
      });
    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("untimeout:confirm")
        .setLabel("Confirm")
        .setStyle("Danger"),
      new ButtonBuilder()
        .setCustomId("untimeout:cancel")
        .setLabel("Cancel")
        .setStyle("Secondary"),
    );

    inter
      .reply({
        embeds: [confirmationEmbed],
        components: [buttons],
        ephemeral: true,
      })
      .then((msg) => {
        const collector = msg.createMessageComponentCollector({ idle: 10000 });

        collector.on("collect", async (i) => {
          if (i.customId == "untimeout:confirm") {
            const processEmbed = new EmbedBuilder()
              .setColor(cli.color)
              .setTitle("Un-Timeout Commands")
              .setDescription("Removing Timeout from the member...")
              .setFooter({
                text: cli.user.username,
                iconURL: cli.user.displayAvatarURL({ dynamic: true }),
              });

            await i.update({
              embeds: [processEmbed],
              components: [],
            });

            await member.timeout(null);

            const finishedEmbed = new EmbedBuilder()
              .setColor(cli.color)
              .setTitle("Un-Timeout Commands")
              .setDescription(`${member} is no longer timeouted!`)
              .setFooter({
                text: "You can close this message window now",
              });

            msg.edit({
              embeds: [finishedEmbed],
              components: [],
            });
          } else if (i.customId == "untimeout:cancel") {
            const cancelledEmbed = new EmbedBuilder()
              .setColor(cli.color)
              .setTitle(`Un-Timeout Commands`)
              .setDescription(`Un-Timeout ${member} has been Cancelled.`)
              .setFooter({
                text: "You can close this message window now",
              });

            i.update({
              embeds: [cancelledEmbed],
              components: [],
            });
          }
        });

        collector.on("end", async () => {
          const msgC = await msg.fetchReply();
          if (!msg) return;
          if (!msgC.components.length) return;

          const noInteractionEmbed = new EmbedBuilder()
            .setColor(cli.color)
            .setTitle("Un-Timeout Commands")
            .setDescription(
              "No interaction received in the span of 10 seconds. Un-Timeout Cancelled",
            )
            .setFooter({
              text: "You can close this message window now",
            });

          buttons.components.forEach((c) => c.setDisabled(true));

          msg.edit({
            embeds: [noInteractionEmbed],
            components: [],
          });
        });
      });
  },
};
