const SlashInteraction = require('./InteractionAddon/slashInteraction');
const ButtonInteraction = require('./InteractionAddon/buttonInteraction');

module.exports = {
    name: 'InterExec',
    type: 'interactionCreate',
    async exec(inter, cli) {
        SlashInteraction(inter, cli);
        ButtonInteraction(inter, cli);
    }
};
