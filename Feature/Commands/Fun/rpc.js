const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rpc")
    .setDescription("Play Rock Paper Scissors with the Bot!")
    .addStringOption((opt) =>
      opt
        .setName("choices")
        .setDescription("Choose your choice!")
        .setRequired(true)
        .addChoices(
          { name: "🪨 | Rock", value: "🪨 Rock" },
          { name: "📄 | Paper", value: "📄 Paper" },
          { name: "✂️ | Scissor", value: "✂️ Scissor" },
        ),
    ),
  exec(client, interaction) {
    const { options } = interaction;

    let Arr = ["🪨 Rock", "📄 Paper", "✂️ Scissor"];
    let user = options.getString("choices");
    let bot = Arr[Math.floor(Math.random() * Arr.length)];

    function RPC(input1, input2) {
      let result;

      switch (true) {
        case input1 == input2:
          result = "Tie";
          break;
        case input1 == "🪨 Rock":
          {
            switch (input2) {
              case "📄 Paper":
                result = "Lose";
                break;
              case "✂️ Scissor":
                result = "Win";
                break;
            }
          }
          break;
        case input1 == "✂️ Scissor":
          {
            switch (input2) {
              case "📄 Paper":
                result = "Win";
                break;
              case "🪨 Rock":
                result = "Lose";
                break;
            }
          }
          break;
        case input1 == "📄 Paper":
          {
            switch (input2) {
              case "🪨 Rock":
                result = "Win";
                break;
              case "✂️ Scissor":
                result = "Lose";
                break;
            }
          }
          break;
      }

      const rpcEmbed = new EmbedBuilder()
      .setColor(client.gColor)
      .setTitle("Results!")
      .addFields(
        {
          name: "You",
          value: `\`\`\` ${user} \`\`\``,
          inline: true
        },
        {
          name: "Bot",
          value: `\`\`\` ${bot} \`\`\``,
          inline: true
        },
        {
          name: "Final Result",
          value: `\`\`\` ${result != "Tie" ? `You ${result}!` : `Both Tied!`} \`\`\``
        }
      )
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({size: 1024, dynamic: true})
    })

      interaction.reply({ embeds: [rpcEmbed] });
    }

    RPC(user, bot);
  },
};
