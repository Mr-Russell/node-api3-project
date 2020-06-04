// code away!
require('dotenv').config()

const server = require('./server.js');

const port = process.env.PORT || 4001

server.get("/", (req, res) => {
  res.status(200).json({
    port: `API Deployed on Port ${process.env.PORT}`,
    greeting: process.env.GREET
  })
})

server.listen(port, () => {
  console.log(`\n* Server Running on port ${port} *\n`);
});
