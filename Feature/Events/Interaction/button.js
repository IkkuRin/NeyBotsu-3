const { ButtonInteraction, EmbedBuilder, Collection, PermissionsBitField } = require('discord.js');
const ms = require('pretty-ms');
const cooldown = new Collection();

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

    let timeLeft = cooldown.get(`${button.id}:${interaction.user.id}`) ? ms(cooldown.get(`${button.id}:${interaction.user.id}`) - Date.now(), {compact: true}):null;
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

    if (cooldown.has(`${button.name}:${interaction.user.id}`)) return message.reply({
      embeds: [cooldownEmbed]
    }).then(m => setTimeout(() => m.delete(), cooldown.get(`${button}:${interaction.user.id}`) - Date.now()))
    
    try {
      button.exec(client, interaction);
      if (!command.cooldown) return;
      cooldown.set(`${button.name}:${interaction.user.id}`, Date.now() + command.cooldown);
      setTimeout(() => cooldown.delete(`${button.name}:${interaction.user.id}`), command.cooldown)
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