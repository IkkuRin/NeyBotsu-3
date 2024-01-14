module.exports = {
  name: "Ready",
  type: "ready",
  once: true,
  exec(client) {
    const { guilds, user } = client;
const { fg, reset, bright } = require("../../../Structure/Function/consoleColor");
    const { consoleWait } = require("../../../Structure/Function/consoleLoading")
    const { commands, legacy } = require("../../../Structure/Handlers/allInOneHandler");

    commands(client);
    legacy(client)

    const activityArr = [
      user.username,
      `Servicing at ${guilds.cache.size} Servers~`,
      `created by @choconeychii`,
      `use /help for more info~`,
      `use /invite to invite me~`
    ];

    let ac = 0;
    setInterval(() => {
      client.user.setActivity({
        name: activityArr[ac],
        type: 4
      });
      ac++;
      ac === activityArr.length ? ac = 0 : ac;
    }, 10000);

    const loadArr = [
     `${fg.yellow}Initiating Client`,
     `${fg.green}Client Online!`,
     `${fg.yellow}Loading Files`,
    `${fg.yellow}Validating Files`,
     `${fg.green}All Files Successfully Loaded`,
     `${fg.yellow}Connecting to Application`,
    `${fg.green + bright}Connected to ${fg.yellow}NeyBotsu Application`,
    `${fg.green}Initiating Bot`,
    `${fg.green + bright}Client Connected to Discord as ${fg.magenta + client.user.username}`,
    ];
      
        consoleWait(loadArr[0], 4000, 500, loadArr[1], true);
setTimeout(() => {
  consoleWait(loadArr[2], 6000, 500);
}, 4000)
    setTimeout(() => {
  consoleWait(loadArr[3], 8000, 500, loadArr[4], true);
}, 10000)
    setTimeout(() => {
  consoleWait(loadArr[5], 4000, 500, loadArr[6], true);
}, 18000)
    setTimeout(() => {
  consoleWait(loadArr[7], 6000, 500, loadArr[8]);
}, 22000)
  },
};
