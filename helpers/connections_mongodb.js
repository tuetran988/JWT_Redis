const mongoose = require("mongoose");

const conn = mongoose.createConnection(
  "mongodb+srv://tutorial:Abc123456789@cluster0.zmqgyha.mongodb.net/?retryWrites=true&w=majority"
);

conn.on("connected", function () {
  console.log(`Mongodb connected:::::: ${this.name}`);
});
conn.on("disconnected", function () {
  console.log(`Mongodb disconnected:::::: ${this.name}`);
});

conn.on("error", function (error) {
  console.log(`Mongodb error:::::: ${JSON.stringify(error)}`);
});

process.on("SIGINT", async function () {
  await conn.close();
  process.exit(0);
});

module.exports = conn;
