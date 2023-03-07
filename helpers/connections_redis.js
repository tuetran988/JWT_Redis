const redis = require("redis");

const client = redis.createClient({
  port: 6379,
  host: "127.0.0.1",
});

client.ping((err, pong) => {
  console.log(pong);
});
client.on("error", (err) => console.log("Redis Client Error", err));
client.on("connect", () => console.log("connected"));
client.on("ready", () => console.log("ready"));

module.exports = client;
