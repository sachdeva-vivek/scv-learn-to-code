var express = require('express');
var path = require('path'); // you could replace this var with const as well here.
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');

var secret = "secret";

var app = express();

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
}

app.use(allowCrossDomain);

app.use(expressJwt({
  secret: secret,
  credentialsRequired: false,
  getToken: function fromHeaderOrQuerystring (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
}));

app.use('/api', expressJwt({secret: secret}));


app.use(function(err, req, res, next) {
  if (err.constructor.name === 'UnauthorizedError') {
    res.status(401).send('Unauthorized');
  }
});
//app.use('/public', express.static(path.join(__dirname, 'public'))); // make the public folder static
app.use(bodyParser.urlencoded({extended: true})) // this is a middleware. it can modify request/response.
app.use(bodyParser.json()); // support json encoded bodies
app.use(allowCrossDomain);

var db;

app.get('/', function(req, res) {
  res.send("server is running fine.");
});

app.get('/api/items', function(req, res) {
  db.collection('items').find(
    {
      $or:[
        {status:"pending"},
        {status:"done"}
      ]
    }).toArray(function(err, results) {
    if (err) {
      res.send("error occurred.. "+err)
    } else {
      res.send(results);
    }
  })
});

app.post('/api/item', function (req, res) {
  db.collection('items').insert(req.body, function(err, result) {
    console.log("result: "+result.ops[0]._id);
    if (err) {
      res.send("error...")
    } else {
      res.send({_id: result.ops[0]._id, status: 'pending' });
    }
  })
});

app.put('/api/item', function (req, res) {

  db.collection('items').updateOne(
      { "_id" : ObjectID(req.body._id) },
      {
        $set: { "status": req.body.status }
      }, function(err, results) {
        if (err) {
          res.send("error...")
        } else {
          res.send({_id: req.body._id, status: req.body.status });
        }
   });


});

 // signup -> test/test123 ->  test/asdfasdfasdfsadf+abcd
 //login test/test1234 -> get me the user where user-name =  test
 // do the bcrypt on test1234 .. is that equal to asdfasdfasdfsadf


app.post('/login', function(req, res) {

  if (req.body.userName !== "test" && req.body.password !== "test") {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end();
  } else {
    var userObject = {
      first_name: 'Vivek',
      last_name: 'Sachdeva',
      email: 'vivek@test.com',
      id: 123456
    };
    // We are sending the profile inside the token
    var token = jwt.sign(userObject, secret, { expiresIn: 60*60 });
    res.json({ token: token });
  }
});

MongoClient.connect('mongodb://vivek:test123@localhost:11501/todo-items', function(err, database) {

//MongoClient.connect('mongodb://localhost:11501/todo-items', function(err, database) {

  if (err) {
    console.console.log(err);
  } else {
    db = database;
    const server = app.listen(8081, function() {
      console.log("Listening on 8081")
    });
  }

});

// db.createUser(
//   {
//     user: "admin",
//     pwd: "admin",
//     roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
//   }
// )
//
// db.createUser({ user: "vivek", pwd: "test123", roles: [{ role: "dbOwner", db: "todo-items" }] })
