var express = require('express');
var path = require('path'); // you could replace this var with const as well here.
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient
var app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use('/public', express.static(path.join(__dirname, 'public'))); // make the public folder static
app.use(bodyParser.urlencoded({extended: true})) // this is a middleware. it can modify request/response.
app.use(bodyParser.json()); // support json encoded bodies
app.use(allowCrossDomain);

var db;

app.get('/', function(req, res) {
  res.send("server is running fine.");
  //res.header("Access-Control-Allow-Origin", "*");
  //res.header("Access-Control-Allow-Headers", "X-Requested-With");
  //res.sendFile(__dirname + '/public/index8.html');
});


app.get('/items', function(req, res) {
  db.collection('items').find().toArray(function(err, results) {

    if (err) {
      res.send("error occurred..")
    } else {
      //console.log(results);
      res.send(results);
    }

  })
});

app.delete('/item', function(req, res) {


  db.collection('items').remove({_id: 5}, function(err, results) {
    if (err) {
      res.send("error occurred..")
    } else {
      //console.log(results);
      res.send(results);
    }
  });



});

app.post('/item', function (req, res) {
  console.log(req.body);
  db.collection('items').save(req.body, function(err, result) {
    if (err) {
      res.send("error...")
    } else {
      res.send("success...");
    }
    //console.log('saved to database')
    //res.redirect('/')
  })

});

MongoClient.connect('mongodb://localhost:11501/todo-items', function(err, database) {

  if (err) {
    console.console.log(err);
  } else {
    db = database;
    const server = app.listen(8081, function() {
      console.log("Listening on 8081")
    });
  }

});
