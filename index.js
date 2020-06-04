// code away!
const server = require('./server.js');

const port = 4001

server.listen(port, () => {
  console.log(`\n* Server Running on port ${port} *\n`);
});
