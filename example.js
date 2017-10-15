steam   = require('./index.js');
discord   = require('./discord.js');

global.num = 0;
global.arr = [];
global.arrayValoriDiscord = [];
global.nomeUtente = '';
global.SocketID = [];
global.inAscolto = 0;
global.inGame = '';
global.inIndice = 0;

var connectCounter = 0;

var clientPUBG2Slot = 0;
var clientDiscord = 0;
var clientForm = 0;
var clientRicerca = 0;
var clientIndex = 0;

var LinkDiscord = 'aaaaaaaaaaa';
var fs = require('fs');

var app = require('express')();
var session = require('express-session')

var http = require('http').Server(app);
var io = require('socket.io').listen(http);

var fs = require('fs');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });

//app.use(require('express-session')({ resave: false, saveUninitialized: false}));
global.arrayGame = new Array();

app.use(session({
  secret: 'token',
  resave: false,
  saveUninitialized: true,
  cookie: { //secure: true,
            login: false,
            maxAge: 60000}
}))

app.engine('html', require('ejs').renderFile);

app.use(steam.middleware({
  realm: 'http://localhost:8080/', 
  verify: 'http://localhost:8080/verify',
  apiKey: process.argv[2]}
));

app.get('/', function(req, res) { 
  var sessData = req.session;
  if(req.user != null && sessData.login == false) {
    sessData.username = req.user.username;
    sessData.country = req.user.country;
    sessData.linkProfile = req.user.profile;
    sessData.avatar = req.user.avatar;
    sessData.steamID = req.user.steamid;
    sessData.login = true;
  } else {
    sessData.username = 'user test';
    sessData.country = 'country test';
    sessData.linkProfile = 'link test';
    sessData.avatar = 'avatar test';
    sessData.steamID = 'steamid test';
  }
    res.render( __dirname+'/views/index.html', { 
      user:sessData.username,
      country:sessData.country
    });
  });

app.get('/authenticate', steam.authenticate(), function(req, res) {
  res.redirect('/');
});

app.get('/form', function (req, res) {
    var sessData = req.session;
    res.render( __dirname+'/views/form.html', { user:sessData.username } );
});




class DiscordGame {
  constructor(Player, SteamID, Game, Full, Link, Slot, Client) {
    this.players = [Player];
    this.steamID = [SteamID]
    this.game = Game;
    this.full = Full;
    this.link = Link;
    this.slot = Slot;
  }
  toString() {
    return `Players ${ this.players }.`;
  }
  getGame() {
    return this.game;
  }
  getSlot() {
    return this.slot;
  }  
  controlFull() {
    if(this.players.length >= this.slot) {
      return this.full = true;
    } return this.full = false;
  } 
}
// class Employee extends Person {
//   constructor(name, hours) {
//     super(name);
//     this.hours = hours;
//   }
//   toString() {
//     return `${ super.toString() } I work ${ this.hours } hours.`;
//   }
// }
var avvioServer = true;
app.post('/ricerca', urlencodedParser, function (req, res){

      var Game = req.body.selectbasic;
      var Lobby = req.body.radios;
      var Nome = req.body.fname;
      var steamID_Test = req.body.idsteam;
      var sessData = req.session;

      sessData.game = Game;
      sessData.lobbySlot = Lobby;
      sessData.username = Nome; ////////////////////////////////////
      sessData.steamID = steamID_Test;

          //indice: serve a leggere quanto è lungo l'oggetto composto da array
          var indice = 0;
          //controllo per evitare l'add del player e la creazione contemporaneamente
          var controllo = false;

          arrayGame.forEach(function(element,index) {
            indice = index;

           });
           arrayGame.forEach(function(element,index) {
            controllo == false;
            if(element.game == sessData.game && element.full == false && element.slot == sessData.lobbySlot
              && element.players.length >= 1 && controllo == false && element.steamID.find(controllaIDSteam) != sessData.steamID){
              element.players.push(sessData.username);
              element.steamID.push(sessData.steamID);
              console.log("Add Player: " + sessData.username);
              console.log(arrayGame);
              controllo = true;

            } else if(indice == index && element.steamID.find(controllaIDSteam) != sessData.steamID){
            
            console.log("alternativa");
              //creazione canale
            serverDiscord = new DiscordGame(sessData.username, sessData.steamID, sessData.game, false, 'link', sessData.lobbySlot);
            arrayGame.push(serverDiscord);

            inIndice = indice + 1;
            inAscolto = 1;
            var refreshId1 = setInterval(function() {
              var properID = arrayGame[inIndice].link;
              if (properID != 'link') {
                clearInterval(refreshId1);
                console.log("Crea nuovo Server");
                console.log(arrayGame);
              }
            }, 1000);


            }
          });
            console.log("----------------------");
            ///ciclo che controlla i full
           arrayGame.forEach(function(element) {
            if(element.players.length >= element.slot){
              element.full = true;
            }
          });

            if(avvioServer == true){
            //creo il server di partenza
            serverDiscord = new DiscordGame(sessData.username, sessData.steamID, sessData.game, false, 'link', sessData.lobbySlot);
            arrayGame.push(serverDiscord);
            inAscolto = 1;
            inIndice = 0;
                console.log("Errore 12");

            var refreshId1a = setInterval(function() {
              var properID = arrayGame[inIndice].link;
              if (properID != 'link') {
                clearInterval(refreshId1a);
                console.log("Crea nuovo Server");
                console.log(arrayGame);
              }
            }, 1000);

            avvioServer = false;
          }
            function controllaIDSteam(element) {
              return element == sessData.steamID;
            }
            
          io.on('connection', function (socket) {
            sessData.socketID = socket.id;
           var refreshId1 = setInterval(function() {
              arrayGame.forEach(function(element) {
                if(element.steamID.find(controllaIDSteam) == sessData.steamID 
                  && element.link != 'link'){
                    io.to(sessData.socketID).emit('message', element.link);
                     clearInterval(refreshId1);
                     sessData.steamID = '';
                 };
              
            }, 5000);
            });
            socket.on('disconnect', function(){
              console.log(sessData.username + "scollegato");
              });
      //console.log(sessData.socketID)
      });
    
        //console.log(myMap.get(sessData.game).find(ricercaGioco));
        // if(myMap.get(sessData.game).find(ricercaGioco)){
          
        //   console.log("Aggiunta " + myMap.get(sessData.game));

        // } else {
        //   serverDiscord = new DiscordGame(sessData.username, sessData.game, false, 'link', sessData.lobbySlot);
        //   arrayGame.push(serverDiscord);
        //   myMap.set(sessData.game, arrayGame);
        //   console.log("Creazione " + myMap.get(sessData.game));

        // }

      res.render( __dirname+'/views/ricerca.html', { Game:sessData.game, Gruppo:sessData.lobbySlot } );
 });

app.get('/PUBG2Slot', urlencodedParser, function (req, res){

    arrayValoriDiscord.push('PUBG');
    arrayValoriDiscord.push(2);

    res.render( __dirname+'/views/PUBG2Slot.html', { Game:'PUBG', Gruppo:'Modalità: ' } );
    
});

app.get('/Discord', function (req, res){

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