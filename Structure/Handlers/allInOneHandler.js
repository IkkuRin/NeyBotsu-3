const { loader } = require("../Function/loader");

async function commands(client) {
  console.time("Commands Load Time");

  await client.commands.clear;
  const commands = new Array();
  let commandsArray = new Array();

  const files = await loader("Feature/Commands");

  for (const file of files) {
    try {
      const command = require(file);
      client.commands.set(command.data.name, command);
      commandsArray.push(command.data.toJSON());

      commands.push({
        Command: command.data.name,
        Status: "Loaded",
      });
    } catch (error) {
      console.error(error);
      commands.push({
        Command: file.split("/").pop().slice(0, -3),
        Status: "Failed",
      });
    }
  }

  client.application.commands.set(commandsArray);

  console.table(commands, ["Command", "Status"]);
  console.timeEnd("Commands Load Time");
}

async function events(client) {
  console.time("Events Load Time");

  client.events = new Map();
  const events = new Array();

  const files = await loader("Feature/Events");
  for (const file of files) {
    try {
      const event = require(file);

      const exec = (...args) => event.exec(...args, client);

      const target = event.rest ? client.rest : client;
      target[event.once ? "once" : "on"](event.type, exec);

      client.events.set(event.type, exec);

      events.push({
        Event: event.name,
        Status: "Loaded",
      });
    } catch (error) {
      console.error(error);
      events.push({
        Event: file.split("/").pop().slice(0, -3),
        Status: "Failed",
      });
    }
  }
  console.table(events, ["Event", "Status"]);
  console.timeEnd("Events Load Time");
}

async function legacy(client) {
  console.time("Legacy Load Time");

  await client.legacy.clear();
  let legacies = new Array();

  const files = await loader("Feature/Legacy");

  for (const file of files) {
    try {
      const legacy = require(file);
      client.legacy.set(legacy.name, legacy);

      if (legacy.aliases && Array.isArray(legacy.aliases))
        legacy.aliases.forEach((alias) =>
          client.aliases.set(alias, legacy.name),
        );

      legacies.push({
        Legacy: legacy.name,
        Status: "Loaded",
      });
    } catch (error) {
      console.error(error);
      legacies.push({
        Legacy: file.split("/").pop().slice(0, -3),
        Status: "Failed",
      });
    }
  }

  console.table(legacies, ["Legacy", "Status"]);
  console.timeEnd("Legacy Load Time");
}

async function buttons(client) {
  console.time("Button Load Time");

  await client.buttons.clear();
  let buttons = new Array();

  const files = await loader("Feature/Buttons");

  for (const file of files) {
    try {
      const button = require(file);
      client.buttons.set(button.buttonId, button);

      buttons.push({
        Buttons: button.name,
        Status: "Loaded",
      });
    } catch (error) {
      console.error(error);
      buttons.push({
        Buttons: file.split("/").pop().slice(0, -3),
        Status: "Failed",
      });
    }
  }

  console.table(buttons, ["Buttons", "Status"]);
  console.timeEnd("Button Load Time");
}

module.exports = { commands, events, legacy, buttons };
