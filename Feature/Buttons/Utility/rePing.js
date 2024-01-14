const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
  name: "rePing",
  buttonId: "rePingBtn",
  async exec(client, interaction) {
    const { message } = interaction;
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

    const pingBtn = new ButtonBuilder()
    .setCustomId('rePingBtn')
    .setLabel('Re-Ping')
    .setStyle('Secondary')
    .setDisabled(true)
    const row = new ActionRowBuilder()
    .setComponents(pingBtn)

    const activate = row.setComponents(pingBtn.setDisabled(false));

    interaction.update({
      embeds: [pingEmbed],
      components: [row]
    })
    .then((msg) => {
      const refresher = setInterval(() => msg.edit({embeds: [pingEmbed.setDescription(`Ping: \n\`\`\`${pingTime('ping')}\`\`\`\nUptime: \`\`\`${pingTime('uptime')}\`\`\``)]}), 2500);
      setTimeout(() => {
        clearInterval(refresher)
        msg.edit({
          components: [activate]
        })
      }, 30000);
  })
  }
}