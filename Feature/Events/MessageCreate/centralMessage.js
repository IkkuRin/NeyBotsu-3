const meTags = require('./@MessageAddon/tags');

module.exports = {
    name: 'CentralMessageCreate',
    type: 'messageCreate',
    exec(message, cli) {
        meTags(message, cli);
    }
};
