var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const Influx = require('influx');
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Influx DB Schema

const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'sensorData',
  schema: [
    {
      measurement: 'acceleration',
      fields: { x: Influx.FieldType.FLOAT,y: Influx.FieldType.FLOAT,z:Influx.FieldType.FLOAT },
      tags: ['person']
    }
  ]
});
  influx.getDatabaseNames()
  .then(names => {
    if (!names.includes('sensorData')) {
      return influx.createDatabase('sensorData');
    }
  })
  .then(() => {
    http.listen(4000, function() {
        console.log('listening on *:4000');
     });
  })
  .catch(err => {
    console.error(`Error creating Influx database!`);
  })


app.get('/', function(req, res) {
   res.sendfile('index.html');
});

app.post('/data',(req, res) => {
   console.log(req.body);
  var jsn= eval(req.body)
   var xData=jsn.AccXYZ.toString().split("_")[0];
   var yData=jsn.AccXYZ.toString().split("_")[1];
   var zData=jsn.AccXYZ.toString().split("_")[2];
   influx.writePoints([
    {
      measurement: 'acceleration',
      tags: { person:'jeyaprakash' },
      fields: {x:xData,y:yData,z:zData},
    }
  ]).catch(err => {0
    console.error(`Error saving data to InfluxDB! ${err.stack}`)
  })
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


