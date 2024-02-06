// Importing console colors and handlers
const {
    fg,
    bright,
    reset
} = require('../../../Structure/Modules/consoleColor');
const {
    commands,
    buttons,
    selectMenus,
    modals
} = require('../../../Structure/Handlers/allInOneHandler');

// Exports module
module.exports = {
    name: 'Ready',
    type: 'ready',
    once: true,
    exec(client) {
        const { guilds, user } = client;

        // Calling the handlers function
        selectMenus(client);
        modals(client);
        buttons(client);
        commands(client);

        // Array of activities to display
        const activityArr = [
            user.username,
            `Servicing at ${guilds.cache.size} Servers~`,
            `created by @choconeychii`,
            `use /help for more info~`,
            `use /invite to invite me~`
        ];

        // Call the activity shuffle function
        activityShuffle(activityArr, client, 10000);

        // Log to the console that the bot is ready with 1s delay
        setTimeout(
            () =>
                console.log(
                    `${fg.green + bright + 'Client' + fg.white} Connected to Discord as ${fg.magenta + client.user.username + reset}`
                ),
            1000
        );
    }
};

// Defining the activity shuffle function
function activityShuffle(arr, client, timer, mode) {
    i = 0; // Array counter

    // Define array randomizer funtion
    const randArr = () => {
        return Math.floor(Math.random() * arr.length);
    };
    // Set activity interval
    setInterval(async () => {
        s = randArr(); // Call array randomizer function
        mode = mode === 'shuffle' ? arr[s] : arr[i]; // Check if mode is shuffle or not
        // Set activity
        client.user.setActivity({
            name: mode,
            type: 4
        });
        //Increment the counter by 1 and check if counter value is greater than the array length
        i++;
        i === arr.length ? (i = 0) : i;
    }, timer);
}
