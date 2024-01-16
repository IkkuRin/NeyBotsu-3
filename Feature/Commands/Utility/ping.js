const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const ms = require('pretty-ms');
  
module.exports = {
  cooldown: 30000,
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

    const pingEmbed = () => {
      return new EmbedBuilder()
      .setColor(client.gColor)
      .setTitle('🏓 | Pong!')
      .setDescription(`Ping: \n\`\`\`${pingTime('ping')}\`\`\`\nUptime: \`\`\` ${pingTime('uptime')} \`\`\``)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true})
      })
    };

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
      embeds: [pingEmbed()],
      components: [disabled]
    }).then(async (msg) => {
      const refresher = setInterval(async () => await msg.edit({embeds: [pingEmbed()]}), 2500);
      setTimeout(() => {
        clearInterval(refresher)
        msg.edit({components: [btn]})
      }, 30000);

      const collector = msg.createMessageComponentCollector({idle: 60000})

      collector.on('collect', async (i) => {
        await i.update({embeds: [pingEmbed()], components: [disabled]});
        
        const refresher = setInterval(async () => await msg.edit({embeds: [pingEmbed()]}), 2500);
        
        setTimeout(() => {
       clearInterval(refresher)
       msg.edit({components: [btn]})
      }, 30000);
      });

      collector.on('end', () => {
        msg.edit({components: [disabled]})
      })
   });
  }
}