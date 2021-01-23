// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/mydb";

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });


var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: true })

app.post('/formData', urlencodedParser, function (req, res) {
   
    jsonData = req.body;

    // adding metaData
    jsonData["userId"] = 1;
    jsonData["orderCompleted"] = false;
    jsonData["timestamp"] = Date.now();
    console.log(jsonData);

    res.end();
});

// Express Middleware for serving static files
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.redirect('index.html');
});

app.listen(8080);