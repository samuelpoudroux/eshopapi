require('dotenv').config()
const express = require('express');
let app = express(); // création de l'objet représentant notre application express
const bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var productRouter = require('./routes/products');
var globalSearchRouter = require('./routes/globalSearch');
var authRouter = require('./routes/auth');
var categoryRouter = require('./routes/category');
var imageRouter = require('./routes/image');
const PORT = process.env.PORT || '8080'
const server = app.listen( PORT);


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
app.use('/images', imageRouter);


const io = require("socket.io")(server);
//listen on every connection
let messages = [] 
io.on('connection', (socket) => {
  socket.on('connected', async () => {
    messages.push(
      {id:0, firstName:"virtuel", message : `bienvenue mr/mme que puis je faire pour vous`}, 
      {id:0, firstName:"virtuel", message : `Avez vous déjà un compte chez nous ?`, type:'choice', choice: ['oui', 'non']})
    socket.emit('connected', messages );
  })
  socket.on('newMessage', (data) => {
    messages.push(data)

    if(data.message === 'oui' && data.questionOrigin === `Avez vous déjà un compte chez nous ?`) {
      messages.push({id:0, firstName:"virtuel", message : `Vous voulez découvrir nos produits ?`, type:'choice', choice: ['oui', 'non']})
    } else if(data.message === 'non' && data.questionOrigin === `Avez vous déjà un compte chez nous ?`) {
      messages.push({id:0, firstName:"virtuel", message : `Souhaitez vous vous inscrire ?`, type:'choice', choice: ['oui', 'non']})
    } else if(data.message === 'oui' && data.questionOrigin === `Vous voulez découvrir nos produits ?`){
      messages.push({id:0, firstName:"virtuel", message : `Nous vous dirigeons vers nos produits`, redirect:'products'}  )
      
    }else if(data.message === 'non' && data.questionOrigin === `Vous voulez découvrir nos produits ?`){
      messages.push({id:0, firstName:"virtuel", message : `Souhaitez vous nous contacter ?`, type:'choice', choice: ['oui', 'non']})
    }
    else if(data.message === 'oui' && data.questionOrigin === `Souhaitez vous vous inscrire ?`){
      messages.push({id:0, firstName:"virtuel", message : `Nous vous dirigons vers la page associée`, redirect:'register'})
    }
    else if(data.message === 'non' && data.questionOrigin === `Souhaitez vous vous inscrire ?`){
      messages.push({id:0, firstName:"virtuel", message : `Nous vous laissons donc découvrir notre site tranquillement, vous pouvez trouver nos coordonnées via le formulaire de contact. à bientôt spweb`})
    }
    else if(data.message === 'oui' && data.questionOrigin === `Souhaitez vous nous contacter ?`){
      messages.push({id:0, firstName:"virtuel", message : `Nous vous redirigeons vers notre page contact`, redirect:'contact'})
    }
    else if(data.message === 'non' && data.questionOrigin === `Souhaitez vous nous contacter ?`){
      messages.push({id:0, firstName:"virtuel", message : `Nous vous laissons donc découvrir notre site tranquillement, vous pouvez trouver nos coordonnées via le formulaire de contact. à bientôt spweb`})
    }
      socket.emit('newMessage', messages);
  })
  //Disconnect
  socket.on('disconnect', data => {
messages= []  })

})

