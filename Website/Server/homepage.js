const express = require('express');
const route = express.Router();

route.use(express.static(process.cwd() + '/Website/FrontEnd/Homepage'));

route.get('/homepage', (req, res) => {
    res.sendFile(process.cwd() + '/Website/FrontEnd/Homepage/index.html');
});

module.exports = route;
