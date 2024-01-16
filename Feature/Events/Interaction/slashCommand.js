const { ChatInputCommandInteraction, EmbedBuilder, Collection } = require('discord.js');
const ms = require('pretty-ms');
const cooldown = new Collection();

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

    let timeLeft = cooldown.get(`${command.name}:${interaction.user.id}`) ? ms(cooldown.get(`${command.name}:${interaction.user.id}`) - Date.now(), {compact: true}):null;
    const cooldownEmbed = new EmbedBuilder()
    .setColor(client.gColor)
    .setTitle('Chill down!')
    .setDescription('This commands is on cooldown, spam is not cool dude. Please wait for a while before using this command again')
    .addFields(
      {
        name: 'Cooldowns left',
        value: `\` ${timeLeft} \``
      }
    )
    .setFooter({
      text: client.user.username,
      iconURL: client.user.displayAvatarURL({size:1024,dynamic:true})
    });
    
    if (command.devOnly && !client.settings.devsID.includes(interaction.user.id)) return interaction.reply({
      embeds: [devsOnlyEmbed],
      ephemeral: true
    });

    if (cooldown.has(`${command.name}:${interaction.user.id}`)) return interaction.reply({
      embeds: [cooldownEmbed]
    }).then(m => setTimeout(() => m.delete(), cooldown.get(`${command.name}:${interaction.user.id}`) - Date.now()))

    try {
    command.exec(client, interaction);
    if (!command.cooldown) return;
      cooldown.set(`${command.name}:${interaction.user.id}`, Date.now() + command.cooldown);
      setTimeout(() => cooldown.delete(`${command.name}:${interaction.user.id}`), command.cooldown)
    } catch (e) {
      const devs = new Array();
   client.settings.devsID.forEach(dev => {
      devs.push(`#<${dev}>`)
    });

      const errorEmbed = new EmbedBuilder()
    .setColor(client.gColor)
    .setTitle('An error occured!')
    .setDescription("An error occurred when trying to execute this commands. Please contact the developer if this happened repeatedly to get the issue fixed. Thank you!")
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
    
    interaction.reply({
      embeds: [errorEmbed],
      allowedMentions: {
        repliedUser: false
      }
    }).then((msg) => setTimeout(() => msg.delete(), 30000));
    }
    
  }
}