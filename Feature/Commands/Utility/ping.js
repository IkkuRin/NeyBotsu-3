const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ms = require('pretty-ms');
  
module.exports = {
  data: new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!'),
  exec(client, interaction) {

    function pingTime(params) {
      const ping = client.ws.ping + 'ms'
      const uptime = ms(client.uptime, { verbose: true })
      
      switch(params) {
        case 'ping': return ping
        break;
        case 'uptime': return uptime
        break;
      }
    }

    const pingEmbed = new EmbedBuilder()
    .setColor(client.gColor)
    .setTitle('🏓 | Pong!')
    .setDescription(`Ping: \n\`\`\`${pingTime('ping')}\`\`\`\nUptime: \`\`\` ${pingTime('uptime')} \`\`\``)
    .setFooter({
      text: client.user.username,
      iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true})
    })
    
    interaction.reply({
      embeds: [pingEmbed]
    }).then(msg => {
      const refresher = setInterval(() => msg.edit({embeds: [pingEmbed.setDescription(`Ping: \n\`\`\`${pingTime('ping')}\`\`\`\nUptime: \`\`\`${pingTime('uptime')}\`\`\``)]}), 2500);
      setTimeout(() => clearInterval(refresher), 60000)
      });
  }
}