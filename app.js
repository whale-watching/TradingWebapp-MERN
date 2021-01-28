var express = require('express');
var bodyParser = require('body-parser');

// importing user modules
var orderUtil = require('./orderUtil.js');
var mongoUtil = require('./mongoUtil.js');
var miscUtil = require('./miscUtil.js');

const userId = 1;
var currentAmt = 100;
var holdings = ["BTCUSD"];
var jsonUserData = {"userId":userId, "currentAmt":currentAmt, "holdings":holdings};
mongoUtil.updateUserdataToDb(jsonUserData);

// check if a past order was completed, every 1 sec
var time_interval = 1000; // i.e 1 sec interval
setInterval(function() {
  orderUtil.updateOrders(); // check if previous orders was completed, updates the current Amt accordingly
}, time_interval);

mongoUtil.refreshTable(); // shows all order present in the DB's orders

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: true })
app.post('/formData', urlencodedParser, function (req, res) {
   
    var jsonData = miscUtil.addMetaData(req.body, userId, currentAmt);

    console.log(jsonData);

    mongoUtil.addOrderToDb(jsonData);
    mongoUtil.refreshTable();
    res.end();
});

// Express Middleware for serving static files
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    res.redirect('index.html');
});

app.listen(8080);