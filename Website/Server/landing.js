const express = require("express");
const route = express.Router();

route.use(express.static(process.cwd() + "/Website/FrontEnd/Landing"));

route.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/Website/FrontEnd/Landing/index.html");
});

module.exports = route;
