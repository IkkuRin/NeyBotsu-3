const { ButtonInteraction } = require('discord.js')

module.exports = {
  name: "Buttons",
  type: "interactionCreate",
  /** 
  * @param {ButtonInteraction} interaction
  */
  exec (interaction, client) {
    console.log('Interaction Detected')
    if (!interaction.isButton()) return;
    console.log('Bu5ton Pressed')
    const button = client.buttons.get(interaction.customId);
    if (!button) return;
    console.log('Button Found')

    try {
      console.log('Response Executed')
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