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

const userRouter = require("../routes/userRoute");
const productRouter = require("../routes/productRoute");
const orderRouter = require("../routes/orderRoute");
// const multer = require('multer')
// const axios = require('axios')
app.use(userRouter);
app.use(productRouter);
app.use(orderRouter);

app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/home", async (req, res) => {
  res.render("home");
});

module.exports = app;
