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

    const btn = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId("rePingBtn")
      .setLabel("Ping Again")
      .setStyle("Primary")
    )
    const disabled = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId("rePingBtn")
      .setLabel("Ping Again")
      .setStyle("Primary")
      .setDisabled(true)
    )
    
    interaction.reply({
      embeds: [pingEmbed],
      components: [disabled]
    }).then(async (msg) => {
      const refresher = setInterval(async () => await msg.edit({embeds: [pingEmbed.setDescription(`Ping: \n\`\`\`${pingTime('ping')}\`\`\`\nUptime: \`\`\`${pingTime('uptime')}\`\`\``)]}), 2500);
      setTimeout(async () => {
        await clearInterval(refresher)
        msg.edit({components: [btn]})
      }, 30000);

      setTimeout(async () => {
        if (msg.components[0].components[0].disabled === false) return await msg.edit({components: [disabled]});

        setTimeout(() => msg.edit({components: [disabled]}), 1000 * 2)
      }, 60000 * 5);
      });
  }
}