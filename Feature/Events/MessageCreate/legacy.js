const { PermissionsBitField, EmbedBuilder, Message, Collection } = require('discord.js');
const ms = require('pretty-ms')
const cooldown = new Collection();

module.exports = {
  name: 'Legacy',
  type: 'messageCreate',
  /** 
  * @param {Message} message
  */
  async exec(message, client) {
    if (message.author.bot) return;
    if (!message.content.toLowerCase().startsWith(client.prefix)) return;
    if (!message.guild) return;
    if (!message.member) message.member = await message.guild.members.fetch(message.author.id);

    const args = message.content.slice(client.prefix.length).trim().split(/ +/g);

    const cmd = args.shift().toLowerCase();

    let command = client.legacy.get(cmd);
    if (!command) command = client.legacy.get(client.aliases.get(cmd));
    if (!command) return;

    let timeLeft = cooldown.get(`${command.name}:${message.author.id}`) ? ms(cooldown.get(`${command.name}:${message.author.id}`) - Date.now(), {compact: true}):null;
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

    if (command.userPerms && !message.member.permissions.has(PermissionsBitField.resolve(command.userPerms || []))) {
          const userMissingPermsEmbed = new EmbedBuilder()
    .setColor(client.gColor)
    .setTitle('Missing Permissions!')
    .setDescription('You are missing the required permissions to use this commands')
    .addFields(
      {
        name: 'Required Permission',
        value: `\` ${command.userPerms.join('\n')} \``
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
    if (command.botPerms && !message.guild.members.me.permissions.has(PermissionsBitField.resolve(command.botPerms || []))) {
      const botMissingPermsEmbed = new EmbedBuilder()
      .setColor(client.gColor)
      .setTitle('Missing Permissions!')
      .setDescription('I am missing the required permissions to run this commands')
    .addFields(
      {
        name: 'Required Permission',
        value: `\` ${command.botPerms.join('\n')} \``
      }
    )
    .setFooter({
      text: client.user.username,
      iconURL: client.user.displayAvatarURL({size:1024,dynamic:true})
    });

      
      return message.reply({
      embeds: [botMissingPermsEmbed]
    }).then(m => setTimeout(() => m.delete(), 15000))
    }

    if (cooldown.has(`${command.name}:${message.author.id}`)) return message.reply({
      embeds: [cooldownEmbed]
    }).then(m => setTimeout(() => m.delete(), cooldown.get(`${command.name}:${message.author.id}`) - Date.now()))

    try {
    command.exec(client, message, args)
      if (!command.cooldown) return;
      cooldown.set(`${command.name}:${message.author.id}`, Date.now() + command.cooldown);
      setTimeout(() => cooldown.delete(`${command.name}:${message.author.id}`), command.cooldown)
    } catch (e) {
      console.error(e);

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
    
    message.reply({
      embeds: [errorEmbed],
      allowedMentions: {
        repliedUser: false
      }
    }).then((msg) => setTimeout(() => msg.delete(), 30000));
    }
  }
}