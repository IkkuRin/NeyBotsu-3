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

    command.exec(client, message, args)
  }
}