const express = require("express");
const app = express();
require("dotenv").config();
const client = require("./helpers/connections_redis");
client.set('foo', 'tue')
client.get('foo', (err, data) => {
  if (err) {
    console.log('err');
  }
  console.log(data);
  
})
// require("./helpers/connections_mongodb");
app.use(express.json()); // phai co vi ben resthttp dung contentype = json
app.use(express.urlencoded({ extended: true }));
const createError = require("http-errors");
const userRoute = require("./Routes/User.route.js");
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("homepage");
});

app.use("/user", userRoute);

app.use((req, res, next) => {
  next(createError.NotFound("this router does not exist"));
});

app.use((err, req, res, next) => {
  res.json({
    status: err.status,
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`server running in ${PORT}`);
});
