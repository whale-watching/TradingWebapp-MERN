var express = require('express');
var bodyParser = require('body-parser');

const userId = 1;
var currentAmt = 100;

// creating mongoDb client something
var mongoObj = require('./mongoUtil.js');
mongoObj.updateOrders();
mongoObj.refreshTable();

var util = require('./util.js');

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: true })
app.post('/formData', urlencodedParser, function (req, res) {
   
    jsonData = util.addMetaData(req.body, userId, currentAmt);
    
    console.log(jsonData);

    mongoObj.addOrderToDb(jsonData);
    mongoObj.refreshTable();
    res.end();
});

// Express Middleware for serving static files
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.redirect('index.html');
});

app.listen(8080);