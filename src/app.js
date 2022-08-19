require("./db/mongoose");
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./views"));
hbs.registerPartials(path.join(__dirname, "./partials"));

const user = require("../routes/user");
const product = require("../routes/product");
const order = require("../routes/order");
const errorHandler = require("./middlewares/errorHandler")

app.use("/users", user);
app.use("/products", product);
app.use("/orders", order);
app.use(errorHandler)

app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/home", async (req, res) => {
  res.render("home");
});

module.exports = app;
