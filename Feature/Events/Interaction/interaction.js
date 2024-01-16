const { ChatInputCommandInteraction, EmbedBuilder, Collection, PermissionsBitField } = require('discord.js');
const ms = require('pretty-ms');
const cooldown = new Collection();

module.exports = {
  name: 'interactions',
  type: 'interactionCreate',
  /**
  * @param {ChatInputCommandInteraction} interaction
  */
  async exec(interaction, client) {
    if (interaction.isChatInputCommand()) {

    const command = client.commands.get(interaction.commandName);

      const coolId = `${command.data.name}_${interaction.user.id}`

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

    let timeLeft = cooldown.get(coolId) ? ms(cooldown.get(coolId) - Date.now(), {compact: true}):null;
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

    if (cooldown.has(coolId)) return interaction.reply({
      embeds: [cooldownEmbed]
    }).then(m => setTimeout(() => m.delete(), cooldown.get(coolId) - Date.now()))

    try {
    command.exec(client, interaction);
      
      if (!command.cooldown) return;
      
      cooldown.set(coolId, Date.now() + command.cooldown);
      setTimeout(() => cooldown.delete(coolId), command.cooldown)
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
    
    if (interaction.isButton()) {
    const button = client.buttons.get(interaction.customId);
    if (!button) return;

    const devs = new Array();
   client.settings.devsID.forEach(dev => {
      devs.push(`@<${dev}>`)
    })

      const coolId = `${button.id}:${interaction.user.id}`

    let timeLeft = cooldown.get(coolId) ? ms(cooldown.get(coolId) - Date.now(), {compact: true}):null;
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

        if (!interaction.member.permissions.has(PermissionsBitField.resolve(button.userPerms || []))) {
          const userMissingPermsEmbed = new EmbedBuilder()
    .setColor(client.gColor)
    .setTitle('Missing Permissions!')
    .setDescription('You are missing the required permissions to use this buttons')
    .addFields(
      {
        name: 'Required Permission',
        value: `\` ${button.userPerms.join('\n')} \``
      }
    )
    .setFooter({
      text: client.user.username,
      iconURL: client.user.displayAvatarURL({size:1024,dynamic:true})
    });
      
      return message.reply({
      embeds: [userMissingPermsEmbed]
    }).then(m => setTimeout(() => m.delete(), 15000))
  };
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.resolve(button.botPerms || []))) {
      const botMissingPermsEmbed = new EmbedBuilder()
      .setColor(client.gColor)
      .setTitle('Missing Permissions!')
      .setDescription('I am missing the required permissions to run this buttons')
    .addFields(
      {
        name: 'Required Permission',
        value: `\` ${button.botPerms.join('\n')} \``
      }
    )
    .setFooter({
      text: client.user.username,
      iconURL: client.user.displayAvatarURL({size:1024,dynamic:true})
    });

      
      return interaction.reply({
      embeds: [botMissingPermsEmbed]
    }).then(m => setTimeout(() => m.delete(), 15000))
    }

    if (cooldown.has(coolId)) return message.reply({
      embeds: [cooldownEmbed]
    }).then(m => setTimeout(() => m.delete(), cooldown.get(coolId) - Date.now()))
    
    try {
      button.exec(client, interaction);
      if (!button.cooldown) return;
      cooldown.set(coolId, Date.now() + button.cooldown);
      setTimeout(() => cooldown.delete(coolId), button.cooldown)
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
}