const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
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

   const pingButton = new ButtonBuilder()
    .setCustomId('rePingBtn')
    .setLabel('Ping Again')
    .setStyle('Success')
    .setDisabled(false);

    const row = new ActionRowBuilder()
    .addComponents(pingButton)
    const disabled = row.components[0].setDisabled(true);
    
    interaction.reply({
      embeds: [pingEmbed],
      components: [row]
    }).then(async (msg) => {
      const refresher = setInterval(async () => await msg.edit({embeds: [pingEmbed.setDescription(`Ping: \n\`\`\`${pingTime('ping')}\`\`\`\nUptime: \`\`\`${pingTime('uptime')}\`\`\``)]}), 2500);
      setTimeout(async () => {
        await msg.edit({components: [row]})
        clearInterval(refresher)
      }, 30000);

      setTimeout(async () => await msg.edit({components: [disabled]}), 60000 * 10);
      });
  }
}