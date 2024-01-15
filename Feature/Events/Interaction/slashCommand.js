const { ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'Slash',
  type: 'interactionCreate',
  /**
  * @param {ChatInputCommandInteraction} interaction
  */
  async exec(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    const devs = new Array();
   client.settings.devsID.forEach(dev => {
      devs.push(`@<${dev}>`)
    })

    const outdatedEmbed = new EmbedBuilder()
    .setColor(client.gColor)
    .setTitle('Outdated Command!')
    .setDescription("The command you're trying to use is outdated and may not work anymore. Please contact the developer to get the issue fixed. Thank you!")
    .addFields({
        name: 'Contacts',
        value: `Owner: <@${client.settings.ownerID}>\nDevs: <@${devs.join('\n')}>`
      },
      {
        name: 'Support Server',
        value: `[Click Here](${client.settings.supportServer})`
      })
    .setFooter({
      text: client.user.username,
      iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true })
    });
    
    if (!command) return interaction.reply({
      embeds: [outdatedEmbed],
      ephemeral: true
    });

    const devsOnlyEmbed = new EmbedBuilder()
    .setColor(client.gColor)
    .setTitle('Developer Command!')
    .setDescription("The command you're trying to use is only available for Devs!")
    .setFooter({
      text: client.user.username,
      iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true })
    });
    
    if (command.devOnly && interaction.user.id !== client.settings.devsID) return interaction.reply({
      embeds: [devsOnlyEmbed],
      ephemeral: true
    });

    command.exec(client, interaction);
  }
}