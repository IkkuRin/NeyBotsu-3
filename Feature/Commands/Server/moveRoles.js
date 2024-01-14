const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
  .setName('move-roles')
  .setDescription('Move roles position!')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addRoleOption(opt => opt
      .setName('roles')
      .setDescription('Target Roles to Move!')
      .setRequired(true)
    )
    .addNumberOption(opt => opt
      .setName('position')
      .setDescription('Desired Role Position. note: 1 = lowest position')
      .setMinValue(1)
      .setRequired(true)
    ),
  exec(client, interaction) {
    const { options, guild } = interaction;
    const roles = options.getRole('roles');
    let position = options.getNumber('position');

    const roleSize = guild.roles.cache.size;
    position = position >= roleSize ? roleSize : position;

    const failEmbed = new EmbedBuilder()
    .setColor(client.gColor)
    .setTitle('Failed to Move Roles!')
    .setFooter({
      text: client.user.username,
      iconURL: client.user.displayAvatarURL({size: 1024, dynamic: true})
    })
    
    const moveEmbed = new EmbedBuilder()
    .setColor(client.gColor)
    .setTitle('Roles Moved!')
    .setDescription(`Roles position has been successfully moved!`)
    .addFields(
      {
        name: 'Roles',
        value: `${roles}`,
        inline: true
      },
      {
        name: 'Position',
        value: `\` ${position} \``,
        inline: true
      }
    )
    .setFooter({
      text: client.user.username,
      iconURL: client.user.displayAvatarURL({size: 1024, dynamic: true})
    })

    guild.roles.setPosition(roles.id, position)
      .then(() => interaction.reply({
      embeds: [moveEmbed],
      ephemeral: true
    }))
      .catch((e) => {
      interaction.reply({
      embeds: [failEmbed.setDescription(`Failed to move ${roles} to position \` ${position} \`\n**Reason:**\n\`\`\`${e}\`\`\``)],
      ephemeral: true
    })
      return console.log(e)
    });
  }
}