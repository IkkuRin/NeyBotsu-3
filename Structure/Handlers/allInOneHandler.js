// Importing the file loader module
const { loader } = require('../Modules/loader');
const { fg, bright, reset } = require('../Modules/consoleColor');

// Defining the Commands and Contexts handlers
async function commands(client) {
    // Start timer
    console.time('Commands&Contexts Load Time');

    // Clear collection and defining new arrays for commands and contexts
    await client.commands.clear;
    const commands = new Array();
    let commandsArray = new Array();
    const contexts = new Array();

    // Load commands and contexts file
    const commandFiles = await loader('Feature/Commands');
    const contextFiles = await loader('Feature/Contexts');

    // Looping through all the commands files
    for (const file of commandFiles) {
        // Check if the folder the file is a subfolders and skip the file
        if (skipFolders(file)) {
            commands.push({
                Event: file.split('/').pop().slice(0, -3),
                Status: 'SubFolders'
            });
            continue;
        };        
        try {
            const command = require(file); // Require the file
            client.commands.set(command.data.name, command); // Set the command to the collection
            commandsArray.push(command.data.toJSON()); // Push the command to the array for creating command application commands

            // Push commands to the tables
            commands.push({
                Command: command.data.name,
                Status: 'Loaded'
            });
        } catch (error) {
            // Push failed commands to thr tables
            const fileName = file.split('/').pop().slice(0, -3);
            commands.push({
                Command: fileName,
                Status: 'Failed'
            });
            // Logs the errors
            console.error(
                `An error occured when loading "${fileName}": `,
                error
            );
        }
    }

    // Looping through all the contexts files. same principles with commands one
    for (const file of contextFiles) {
        if (skipFolders(file)) {
            contexts.push({
                Context: file.split('/').pop().slice(0, -3),
                Status: 'SubFolders'
            });
            continue;
        };
        try {
            const context = require(file);
            client.contexts.set(context.data.name, context);
            commandsArray.push(context.data.toJSON()); // we put context together with commands because they're essentially the same

            contexts.push({
                Context: context.data.name,
                Status: 'Loaded'
            });
        } catch (error) {
            const fileName = file.split('/').pop().slice(0, -3);
            contexts.push({
                Context: fileName,
                Status: 'Failed'
            });
            console.error(
                `An error occured when loading "${fileName}": `,
                error
            );
        }
    }

    // Creating the command application commands
    client.application.commands.set(commandsArray);

    // Check if the commands array is empty and push empty array to the tables
    !commands.length
        ? commands.push({ Command: 'Empty', Status: 'No Commands Detected' })
        : commands;
    // Check if the contexts array is empty and push empty array to the tables
    !contexts.length
        ? contexts.push({ Context: 'Empty', Status: 'No Context Detected' })
        : contexts;
    // Logs tables of commands and contexts and end the timer
    console.table(commands, ['Command', 'Status']);
    console.table(contexts, ['Context', 'Status']);
    console.timeEnd('Commands&Contexts Load Time');
}

// Defining the Events handler
async function events(client) {
    // Start timer
    console.time('Events Load Time');

    // Clear collection and define new array for events
    await client.events.clear;
    client.events = new Map();
    const events = new Array();

    // Load events files
    const files = await loader('Feature/Events');

    // Looping through all the events files
    for (const file of files) {
        // Check if the folder the file is a subfolders and skip the file
        if (skipFolders(file)) {
            events.push({
                Event: file.split('/').pop().slice(0, -3),
                Status: 'SubFolders'
            });
            continue;
        };
        try {
            const event = require(file); // Require the file

            // Creating the execute function
            const exec = (...args) => event.exec(...args, client);

            // Check if the events is a once event
            const target = event.rest ? client.rest : client;
            target[event.once ? 'once' : 'on'](event.type, exec);

            // Set the event to the collection
            client.events.set(event.type, exec);

            // Push events to the tables
            events.push({
                Event: event.name,
                Status: 'Loaded'
            });
        } catch (error) {
            // Push failed events to the tables
            const fileName = file.split('/').pop().slice(0, -3);
            events.push({
                Event: fileName,
                Status: 'Failed'
            });
            // Logs the errors
            console.error(
                `An error occured when loading "${fileName}": `,
                error
            );
        }
    }

    // Check if the events array is empty and push empty array to the tables
    !events.length
        ? events.push({ Event: 'Empty', Status: 'No Events Detected' })
        : events;
    // Logs tables of events and end the timer
    console.table(events, ['Event', 'Status']);
    console.timeEnd('Events Load Time');
}

// Everything else follows the same principles
async function buttons(client) {
    console.time('Button Load Time');

    await client.buttons.clear();
    let buttons = new Array();

    const files = await loader('Feature/Buttons');

    for (const file of files) {
        if (skipFolders(file)) {
            buttons.push({
                Button: file.split('/').pop().slice(0, -3),
                Status: 'SubFolders'
            });
            continue;
        };
        try {
            const button = require(file);
            client.buttons.set(button.id, button);

            buttons.push({
                Buttons: button.name,
                Status: 'Loaded'
            });
        } catch (error) {
            const fileName = file.split('/').pop().slice(0, -3);
            buttons.push({
                Buttons: fileName,
                Status: 'Failed'
            });
            console.error(
                `An error occured when loading "${fileName}": `,
                error
            );
        }
    }

    !buttons.length
        ? buttons.push({ Buttons: 'Empty', Status: 'No Button Detected' })
        : buttons;
    console.table(buttons, ['Buttons', 'Status']);
    console.timeEnd('Button Load Time');
}

async function selectMenus(client) {
    console.time('Select Menu Load Time');

    client.selectMenus.clear();
    let selectMenus = new Array();

    const files = await loader('Feature/SelectMenus');

    for (const file of files) {
        if (skipFolders(file)) {
            selectMenus.push({
                Event: file.split('/').pop().slice(0, -3),
                Status: 'SubFolders'
            });
            continue;
        };
        try {
            const menus = require(file);
            client.selectMenus.set(menus.id, menus);

            selectMenus.push({
                SelectMenus: menus.name,
                Status: 'Loaded'
            });
        } catch (error) {
            const fileName = file.split('/').pop().slice(0, -3);
            selectMenus.push({
                SelectMenus: fileName,
                Status: 'Failed'
            });
            console.error(
                `An error occured when loading "${fileName}": `,
                error
            );
        }
    }
    !selectMenus.length
        ? selectMenus.push({
              SelectMenus: 'Empty',
              Status: 'No Select Menu Detected'
          })
        : selectMenus;
    console.table(selectMenus, ['SelectMenus', 'Status']);
    console.timeEnd('Select Menu Load Time');
}

async function modals(client) {
    console.time('Modals Load Time');

    client.modals.clear();
    let modals = new Array();

    const files = await loader('Feature/Modals');

    for (const file of files) {
        if (skipFolders(file)) {
            modals.push({
                Event: file.split('/').pop().slice(0, -3),
                Status: 'SubFolders'
            });
            continue;
        };
        try {
            const modal = require(file);
            client.modals.set(modal.id, modal);

            modals.push({
                Modals: modal.name,
                Status: 'Loaded'
            });
        } catch (error) {
            const fileName = file.split('/').pop().slice(0, -3);
            modals.push({
                Modals: fileName,
                Status: 'Failed'
            });
            console.error(
                `An error occured when loading "${fileName}": `,
                error
            );
        }
    }
    !modals.length
        ? modals.push({
              Modals: 'Empty',
              Status: 'No Modals Detected'
          })
        : modals;
    console.table(modals, ['Modals', 'Status']);
    console.timeEnd('Modals Load Time');
}

// Define skip folder function
function skipFolders(file) {
    let fileLog = fg.yellow + file.split('/').pop() + reset;
    // Checks if the folder the files is in starts with '@'
    if (file.split('/').slice(0, -1).pop().startsWith('@')) {
        // Logs the skipped files and folders
        console.log(
            `${fg.green + bright + '[HANDLERS]' + reset} Skipped ${fileLog}`
        );
        return true;
    } // Return true if the folders is a subfolder and false if not
    return false;
}

// Exports all the function module
module.exports = { commands, events, buttons, selectMenus, modals };
