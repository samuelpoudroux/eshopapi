require('dotenv').config()
const express = require('express');
let app = express(); // création de l'objet représentant notre application express
const bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var productRouter = require('./routes/products');
var globalSearchRouter = require('./routes/globalSearch');
var authRouter = require('./routes/auth');
var categoryRouter = require('./routes/category');
const PORT = process.env.PORT || '8080'
const server = app.listen( PORT);
const bot = require('./socket')
const io = require("socket.io")(server);

app.use(express.static( __dirname + '/public/productImages/'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/products', productRouter);
app.use('/globalSearch', globalSearchRouter);
app.use('/auth', authRouter);
app.use('/categories', categoryRouter);


//listen on every connection
io.on('connection', (socket) => {
  bot(socket)
})

