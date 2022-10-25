require("./db/mongoose");
const express = require("express");
const errorHandler = require("./middlewares/errorHandler")
const app = express();

app.use(express.json());
app.use(errorHandler)

const user = require("../routes/user");
const product = require("../routes/product");
const order = require("../routes/order");

app.use("/users", user);
app.use("/products", product);
app.use("/orders", order);

app.get("/", async (req, res) => {
  res.send("<h1>Online Shop</h1>");
});


module.exports = app;
