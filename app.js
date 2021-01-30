var express = require('express');
var bodyParser = require('body-parser');

// importing user modules
var orderUtil = require('./orderUtil.js');
var mongoUtil = require('./mongoUtil.js');
var miscUtil = require('./miscUtil.js');
var coincapApiUtil = require('./coincapApiUtil.js');
var display = require('./display.js');


const userId = 1;
var currentAmt = 100;
var holdings = ["BTCUSD"];
var jsonUserData = {"userId":userId, "currentAmt":currentAmt, "holdings":holdings};
mongoUtil.updateUserdataToDb(jsonUserData);


orderUtil.updateOrders(); // check if previous orders was completed, updates the current Amt accordingly
coincapApiUtil.startWebsocket(); // update the current price in real time using websocket, runs in backbround

display.displayOrders(); // shows all order present in the database


var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: true })
// this will be run when submit is clicked, i.e any order inserted
app.post('/formData', urlencodedParser, function (req, res) {
   
    var jsonData = miscUtil.addMetaData(req.body, userId, currentAmt);

    console.log(jsonData);

    mongoUtil.addOrderToDb(jsonData);
    display.displayOrders();
    res.end();
});


// Express Middleware for serving static files
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    res.redirect('index.html');
});

app.listen(8080);