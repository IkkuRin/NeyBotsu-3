const { ButtonInteraction } = require('discord.js')

module.exports = {
  name: "Buttons",
  type: "interactionCreate",
  /** 
  * @param {ButtonInteraction} interaction
  */
  exec (interaction, client) {
    if (!interaction.isButton()) return;
    const button = client.buttons.get(interaction.customId);
    if (!button) return;

    const devs = new Array();
   client.settings.devsID.forEach(dev => {
      devs.push(`@<${dev}>`)
    })
    
    try {
      button.exec(client, interaction);
    } catch (error) {
      console.error(error);
      const errorEmbed = new EmbedBuilder()
    .setColor(client.gColor)
    .setTitle('An error occured!')
    .setDescription("An error occured when executing this button. If this happened repeatedly, please contact the developer to get the issue fixed. Thank you!")
    .addFields({
        name: 'Contacts',
        value: `Owner: <@${client.settings.ownerID}>\nDevs: ${devs.join('\n')}`
      },
      {
        name: 'Support Server',
        value: `[Click Here](${client.settings.supportServer})`
      })
    .setFooter({
      text: client.user.username,
      iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true })
    });
    
    interaction.reply({
      embeds: [errorEmbed],
      ephemeral: true
    });
    }
  }
}