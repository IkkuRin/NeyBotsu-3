const express = require('express');
const app = express();
const port = 8080;

app.use((req, res, next) => {
    next();
});

const landingRoute = require('./landing.js');
app.use('/', landingRoute);
const homepageRoute = require('./homepage.js');
app.use('/homepage', homepageRoute);
const inviteRoute = require('./invite.js');
app.use('/invite', inviteRoute);

app.listen(port, () => console.log(`Website is running on port ${port}`));

module.exports = 'website';
