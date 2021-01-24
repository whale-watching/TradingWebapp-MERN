var express = require('express');
var bodyParser = require('body-parser');

var app = express();


// creating Database in MongoDb
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

function addOrderToDb(jsonData) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mainDb");
        dbo.collection("allOrders").insertOne(jsonData, function(err, res) {
          if (err) throw err;
          console.log("inserted to db success");
          db.close();
        });
      });
}


var urlencodedParser = bodyParser.urlencoded({ extended: true })
app.post('/formData', urlencodedParser, function (req, res) {
   
    jsonData = req.body;

    // adding metaData
    jsonData["userId"] = 1;
    jsonData["orderCompleted"] = false;
    jsonData["timestamp"] = Date.now();
    console.log(jsonData);

    addOrderToDb(jsonData);
    res.end();
});

// Express Middleware for serving static files
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.redirect('index.html');
});

app.listen(8080);