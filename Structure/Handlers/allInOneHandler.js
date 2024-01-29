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

  !commands.length
    ? commands.push({ Command: "Empty", Status: "No Commands Detected" })
    : commands;
  console.table(commands, ["Command", "Status"]);
  console.timeEnd("Commands Load Time");
}

async function events(client) {
  console.time("Events Load Time");

  for (const [key, value] of client.events) {
    await client.removeListener(`${key}`, value, true);
  }
  await client.events.clear;
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

  !events.length
    ? events.push({ Event: "Empty", Status: "No Events Detected" })
    : events;
  console.table(events, ["Event", "Status"]);
  console.timeEnd("Events Load Time");
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

  !buttons.length
    ? buttons.push({ Buttons: "Empty", Status: "No Button Detected" })
    : buttons;
  console.table(buttons, ["Buttons", "Status"]);
  console.timeEnd("Button Load Time");
}

module.exports = { commands, events, buttons };
