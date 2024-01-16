const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
  name: 'tagged',
  type: 'messageCreate',
  exec (message, client) {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.mentions.has(`${client.user.id}`)) return;

    const tagEmbed = new EmbedBuilder()
    .setColor(client.gColor)
    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({size:1024,dynamic:true})})

    .setTitle(`Ney respond to call!`)
    .setDescription(`Hello ${message.author.username}! What can i do for you?`)
    .setFooter({text:'Use button below~'});

    const aboutButton = new ButtonBuilder()
    .setCustomId('tag:about')
    .setLabel('About')
    const helpButton = new ButtonBuilder()
    .setCustomId('tag:help')
    .setLabel('Help');
    const otherButton = new ButtonBuilder()
    .setCustomId('tag:other')
    .setLabel('Other');
    const row = new ActionRowBuilder()
    .addComponents(aboutButton, helpButton, otherButton);

    message.reply({
      embeds: [tagEmbed],
      components: [row]
    })
  }
}