const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const ms = require('pretty-ms');

module.exports = {
  name: "rePing",
  buttonId: "rePingBtn",
  async exec(client, interaction) {
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

    const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId('rePingBtn')
      .setLabel('Ping Again')
      .setStyle('Primary')
    )
    const disabled = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId("rePingBtn")
      .setLabel("Ping Again")
      .setStyle("Primary")
      .setDisabled(true)
    )

    interaction.update({
      embeds: [pingEmbed],
      components: [disabled]
    })
    .then((msg) => {
      const refresher = setInterval(() => msg.edit({embeds: [pingEmbed.setDescription(`Ping: \n\`\`\`${pingTime('ping')}\`\`\`\nUptime: \`\`\`${pingTime('uptime')}\`\`\``)]}), 2500);
      setTimeout(() => {
        clearInterval(refresher)
        msg.edit({
          components: [row]
        })
      }, 30000);
  })
  }
}