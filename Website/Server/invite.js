const express = require('express');
const route = express.Router();

route.use(express.static(process.cwd() + '/Website/FrontEnd/Invite'))
route.get('/invite', (req, res) => {
  res.sendFile(process.cwd() + '/Website/FrontEnd/Invite/index.html')
})

module.exports = route;