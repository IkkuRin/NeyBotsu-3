const express = require('express');
const app = express();
const port = 8080

app.use((req, res, next) => {
  next();
})

app.use(express.static(process.cwd() + '/Website/FrontEnd/Invite'))

app.use('/', (req, res) => {
  res.sendFile(process.cwd() + '/Website/FrontEnd/Invite/index.html')
});

app.listen(port, () => console.log(`Website is running on port ${port}`));

module.exports = "website";