const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  devOnly: true,
  data: new SlashCommandBuilder()
  .setName('reload')
  .setDescription('Reloads The Events/Commands')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption(opt => opt
    .setName('option')
    .setDescription('Choose Between Commands or Events to Reload. Leave Blank to Reload All')
    .addChoices(
      { name: 'Commands', value: 'cmd' },
      { name: 'Events', value: 'evt' },
      { name: 'Legacy', value: 'lgc' },
      { name: 'Buttons', value: 'btn' },
    )
  ),
  exec(client, interaction) {
    const { options } = interaction;

    const { commands, events, legacy, buttons } = require('../../../Structure/Handlers/allInOneHandler');
    

    const option = options.getString('option');

    const allEmbed = new EmbedBuilder()
    .setColor(client.gColor)
    .setTitle('Reloaded!')
    .setDescription('Commands and Events has been reloaded')
    .setFooter({
      text: client.user.username,
      iconURL: client.user.displayAvatarURL({size: 1024, dynamic: true})
    })

    const eventsEmbed = new EmbedBuilder()
    .setColor(client.gColor)
    .setTitle('Reloaded!')
    .setDescription('Events has been reloaded')
    .setFooter({
      text: client.user.username,
      iconURL: client.user.displayAvatarURL({size: 1024, dynamic: true})
    })

    const commandsEmbed = new EmbedBuilder()
    .setColor(client.gColor)
    .setTitle('Reloaded!')
    .setDescription('Commands has been reloaded')
    .setFooter({
      text: client.user.username,
      iconURL: client.user.displayAvatarURL({size: 1024, dynamic: true})
    })

    const buttonsEmbed = new EmbedBuilder()
    .setColor(client.gColor)
    .setTitle('Reloaded!')
    .setDescription('Bittons has been reloaded')
    .setFooter({
      text: client.user.username,
      iconURL: client.user.displayAvatarURL({size: 1024, dynamic: true})
    })

    switch(option) {
      case 'cmd': {
        interaction.reply({
          embeds: [commandsEmbed],
          ephemeral: true
        })

        commands(client);
      }
        break;
      case 'btn': {
        interaction.reply({
          embeds: [buttonsEmbed],
          ephemeral: true
        })

        buttons(client);
      }
        break;
      case 'lgc': {
        interaction.reply({
          embeds: [commandsEmbed],
          ephemeral: true
        })

        legacy(client);
      }
        break;
      case 'evt': {
        for (const [key, value] of client.events)
          client.removeListener(`${key}`, value, true);
        
        interaction.reply({
          embeds: [eventsEmbed],
          ephemeral: true
        });

        events(client);
      }
        break;
      default: {
        for (const [key, value] of client.events)
          client.removeListener(`${key}`, value, true);
        
        interaction.reply({
          embeds: [allEmbed],
          ephemeral: true
        });

        events(client);
        commands(client);
        legacy(client);
        buttons(client);
      }
        break;
    }
  }
}