steam   = require('./index.js');
discord   = require('./discord.js');

global.num = 0;
global.arr = [];
global.arrayValoriDiscord = [];
global.nomeUtente = '';
global.SocketID = [];
global.inAscolto = 0;
var connectCounter = 0;

var clientPUBG2Slot = 0;
var clientDiscord = 0;
var clientForm = 0;
var clientRicerca = 0;
var clientIndex = 0;

var LinkDiscord = 'aaaaaaaaaaa';
var fs = require('fs');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

var fs = require('fs');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });

app.use(require('express-session')({ resave: false, saveUninitialized: false, secret: 'a secret' }));

app.engine('html', require('ejs').renderFile);

app.use(steam.middleware({
  realm: 'http://localhost:8080/', 
  verify: 'http://localhost:8080/verify',
  apiKey: process.argv[2]}
));

app.get('/', function(req, res) {
  var user = req.user == null ? '' : '' + req.user.username;
      try {
      var country = req.user.country;
      } catch (err) {
        // Handle the error here.
      }
    res.render( __dirname+'/views/index.html', { user:user, country:country} );
});

app.get('/authenticate', steam.authenticate(), function(req, res) {
  res.redirect('/');
});

app.get('/form', function (req, res) {
    var user = "test user";
    //console.log(user);
    res.render( __dirname+'/views/form.html', { user:user } );
  
});

app.post('/ricerca', urlencodedParser, function (req, res){
      var Game = req.body.selectbasic;
      var Gruppo = req.body.radios;


      //reply += "ID: " + req.user.steamid;
      //reply += "Username: " + req.user.username;
      //nomeUtente = req.user.username;
      //se mette PUBG 2v2
      if(Game == 'PUBG' && Gruppo == 2){
        res.redirect('/PUBG2Slot');
      } else {
              res.render( __dirname+'/views/ricerca.html', { Game:Game, Gruppo:Gruppo } );

      }
  //num++;
 });


    io.sockets.on('connection', function (socket, username) {
    // When the client connects, they are sent a message
    socket.emit('message', 'You are connected!');
    // The other clients are told that someone new has arrived
    socket.broadcast.emit('message', 'Another client has just connected!');

    // As soon as the username is received, it's stored as a session variable
    socket.on('little_newbie', function(username) {
        socket.username = username;
    });

    // When a "message" is received (click on the button), it's logged in the console
    socket.on('message', function (message) {
        // The username of the person who clicked is retrieved from the session variables
        console.log(socket.username + ' is speaking to me! They\'re saying: ' + message);
    }); 
});


app.get('/PUBG2Slot', urlencodedParser, function (req, res){

    arrayValoriDiscord.push('PUBG');
    arrayValoriDiscord.push(2);

    res.render( __dirname+'/views/PUBG2Slot.html', { Game:'PUBG', Gruppo:'Modalità: ' } );
    
});

app.get('/Discord', function (req, res){
    inAscolto = 1;
    res.render( __dirname+'/views/Discord.html');
 });

app.get('/verify', steam.verify(), function(req, res) {
    res.redirect('/');
  //res.send(req.user).end();
});

app.get('/logout', steam.enforceLogin('/'), function(req, res) {
  req.logout();
  res.redirect('/');
});


http.listen(8080, function(){
  console.log('Server Online');
});
discord.discord();