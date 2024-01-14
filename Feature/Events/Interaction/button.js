module.exports = {
  name: "Buttons",
  type: "InteractionCreate",
  exec (client, interaction) {
    if (!interaction.isButton()) return;
    const button = client.buttons.get(interaction.customId);
    if (!button) return;

    try {
      button.exec(client, interaction);
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: "An error occurred while executing the button.",
        ephemeral: true
      });
    }
  }
}