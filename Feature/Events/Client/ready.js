module.exports = {
    name: 'Ready',
    type: 'ready',
    once: true,
    exec(client) {
        const { guilds, user } = client;
        const {
            fg,
            bright,
            reset
        } = require('../../../Structure/Function/consoleColor');
        const {
            consoleWait
        } = require('../../../Structure/Function/consoleLoading');
        const {
            commands,
            buttons
        } = require('../../../Structure/Handlers/allInOneHandler');

        commands(client);
        buttons(client);

        const activityArr = [
            user.username,
            `Servicing at ${guilds.cache.size} Servers~`,
            `created by @choconeychii`,
            `use /help for more info~`,
            `use /invite to invite me~`
        ];

        function activityShuffle(arr, timer, mode) {
            i = 0;
            const randArr = () => {
                return Math.floor(Math.random() * arr.length);
            };
            setInterval(async () => {
                s = randArr();
                mode = mode === 'shuffle' ? arr[s] : arr[i];
                client.user.setActivity({
                    name: mode,
                    type: 4
                });
                i++;
                i === activityArr.length ? (i = 0) : i;
            }, timer);
        }

        activityShuffle(activityArr, 10000);

        const loadArr = [
            `${fg.yellow}Initiating Client`,
            `${fg.green}Client Online!`,
            `${fg.yellow}Loading Files`,
            `${fg.yellow}Validating Files`,
            `${fg.green}All Files Successfully Loaded`,
            `${fg.yellow}Connecting to Application`,
            `${fg.green + bright}Connected to ${fg.yellow}NeyBotsu Application`,
            `${fg.green}Initiating Bot`,
            `${fg.green + bright}Client Connected to Discord as ${fg.magenta + client.user.username + reset}`
        ];

        if (client.settings.fancyStartup == true) {
            consoleWait(loadArr[0], 4000, 500, loadArr[1], true);
            setTimeout(() => {
                consoleWait(loadArr[2], 6000, 500);
            }, 4000);
            setTimeout(() => {
                consoleWait(loadArr[3], 8000, 500, loadArr[4], true);
            }, 10000);
            setTimeout(() => {
                consoleWait(loadArr[5], 4000, 500, loadArr[6], true);
            }, 18000);
            setTimeout(() => {
                consoleWait(loadArr[7], 6000, 500, loadArr[8], true);
            }, 22000);
        } else {
            setTimeout(() => console.log(loadArr[8]), 2500);
        }
    }
};
