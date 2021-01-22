// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/mydb";

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });


var express = require('express'),
    app = express();

// Express Middleware for serving static files
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.redirect('index.html');
});

app.listen(8080);