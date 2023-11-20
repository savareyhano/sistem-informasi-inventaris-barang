const app = require("./app");
require("dotenv").config();
const host = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening to the server on http://${host}:${port}`);
});
