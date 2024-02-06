// Imports all interaction events module
const path = process.cwd() + '/Structure/InteractionAddon/'
const SlashInteraction = require(path + 'slashInteraction');
const ButtonInteraction = require(path + 'buttonInteraction');
const SelectMenuInteraction = require(path + 'menuInteraction' );;
const ModalInteraction = require(path + 'modalInteraction');
const ContextInteraction = require(path + 'contextInteraction');

// Exports module
module.exports = {
    name: 'InteractionExecute',
    type: 'interactionCreate',
    async exec(inter, cli) {
        // Call the interaction events module
        SlashInteraction(inter, cli);
        ButtonInteraction(inter, cli);
        SelectMenuInteraction(inter, cli);
        ModalInteraction(inter, cli);
        ContextInteraction(inter, cli);
    }
};
