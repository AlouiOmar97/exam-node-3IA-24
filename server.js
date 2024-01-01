var express= require('express')
var http= require('http')
var path= require('path')
var commandesRouter= require('./controllers/commandeController')
var { socketIO } = require('./services/commandeService')
var app= express()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
//Routes
app.use('/commandes', commandesRouter)

var server=http.createServer(app)
const io = socketIO(server);
server.listen(3000,()=> console.log("server started"))
