require("dotenv").config();
const express = require("express");
let app = express(); // création de l'objet représentant notre application express
const bodyParser = require("body-parser");
var indexRouter = require("./routes/index");
var productRouter = require("./routes/products");
var globalSearchRouter = require("./routes/globalSearch");
var authRouter = require("./routes/auth");
var categoryRouter = require("./routes/category");
var contactRouter = require("./routes/contact");
var userRouter = require("./routes/user");
var orderRouter = require("./routes/order");
var paiementRouter = require("./routes/paiement");
const PORT = process.env.PORT || "8080";
var enforce = require("express-sslify");

const server = app.listen(PORT);
const bot = require("./socket");
const io = require("socket.io")(server);
var cors = require("cors");

app.use(express.static(__dirname + "/public/productImages/"));
app.use(express.static(__dirname + "/public/categoryImages/"));
process.env === "production" && app.use(enforce.HTTPS());
app.use(express.static(__dirname + "/public/productImages/"));
var corsOptions = {
  origin: process.env.FRONT_URL,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/products", productRouter);
app.use("/globalSearch", globalSearchRouter);
app.use("/auth", authRouter);
app.use("/categories", categoryRouter);
app.use("/contact", contactRouter);
app.use("/user", userRouter);
app.use("/order", orderRouter);
app.use("/paiement", paiementRouter);

//listen on every connection
io.on("connection", (socket) => bot(socket, io));
