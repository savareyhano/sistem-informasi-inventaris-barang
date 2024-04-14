const app = require('./app');
require('dotenv').config();

const host = process.env.HOSTNAME;
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Listening to the server on http://${host}:${port}`);
});
