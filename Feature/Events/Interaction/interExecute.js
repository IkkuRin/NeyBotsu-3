const { SlashInteraction } = require("./InteractionAddon/slashInteraction");
const { ButtonInteraction } = require("./InteractionAddon/buttonInteraction");

module.exports = {
  name: "InterExec",
  type: "interactionCreate",
  async exec(inter, cli) {
    await SlashInteraction(inter, cli);
    await ButtonInteraction(inter, cli);
  },
};
