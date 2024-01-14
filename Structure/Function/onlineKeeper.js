const { EmbedBuilder } = require('discord.js');
const RandExp = require('randexp')

async function keeper(client) {
  const process = async () => {
  if (client.settings.keepOnline.enabled == false) return;
  const key = new RandExp(/^[a-zA-Z0-9]{32}$/).gen();

  msg = await client.channels.cache.get(client.settings.keepOnline.channel).messages.fetch(client.settings.keepOnline.message)

  msg.edit({
    embeds: [
      new EmbedBuilder()
      .setColor(client.gColor)
      .setTitle("Key Randomizer")
      .setDescription(`Keeping the bot online by constant call and feed.\n\n**Key:**\n\`\`\`${key}\`\`\``)
      .setFooter({text: 'if the key doesn\'t change every 5 seconds then the bot is offline!'})
    ]
  })
  }
  setInterval(process, client.settings.keepOnline.interval * 1000)
}

module.exports = {keeper}