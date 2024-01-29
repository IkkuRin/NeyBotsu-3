const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "tagged",
  type: "messageCreate",
  exec(message, client) {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.mentions.has(`${client.user.id}`)) return;

    const tagEmbed = new EmbedBuilder()
      .setColor(client.gColor)
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }),
      })

      .setTitle(`Ney respond to call!`)
      .setDescription(
        `Hello ${message.author.username}! What can i do for you?`,
      )
      .setFooter({ text: "Use button below~" });

    const aboutButton = new ButtonBuilder()
      .setCustomId("tag:about")
      .setLabel("About")
      .setStyle("Primary")
      .setEmoji("💜");
    const helpButton = new ButtonBuilder()
      .setCustomId("tag:help")
      .setLabel("Help")
      .setStyle("Primary")
      .setEmoji("🔎");
    const otherButton = new ButtonBuilder()
      .setCustomId("tag:other")
      .setLabel("Other")
      .setStyle("Primary")
      .setEmoji("❔");
    const row = new ActionRowBuilder().addComponents(
      aboutButton,
      helpButton,
      otherButton,
    );

    message
      .reply({
        embeds: [tagEmbed],
        components: [row],
      })
      .then(async (msg) => {
        const collector = msg.createMessageComponentCollector({
          idle: 60000,
        });

        collector.on("collect", async (i) => {
          await i.deferUpdate();
          i.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.gColor)
                .setDescription("Oops! This feature is not available yet!"),
            ],
          });
        });

        collector.on("end", () => {
          row.components.forEach((c) => c.setDisabled(true));
          msg.edit({ embeds: [tagEmbed], components: [row] });
        });
      });
  },
};
