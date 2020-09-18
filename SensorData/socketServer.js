var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', function(req, res) {
   res.sendfile('index.html');
});

app.post('/data',(req, res) => {
   console.log(req.body);
});

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
   console.log('A user connected');
   setTimeout(function() {
    socket.send('Sent a message 4seconds after connection!');
 }, 4000);
 socket.on('', function(data) {
    console.log(data);
 });
 socket.emit('ferret', 'tobi', 'woot', (data) => { // args are sent in order to acknowledgement function
   console.log(data); // data will be 'tobi says woot'
 });
   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });
});



http.listen(3000, function() {
   console.log('listening on *:3000');
});