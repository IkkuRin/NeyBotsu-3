const { Permissions, EmbedBuilder, Message } = require('discord.js');

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

    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (!command) return;

    try {
    command.exec(client, message, args)
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
    }).then((msg) => setTimeout(() => msg.delete(), 10000));
    }
  }
}