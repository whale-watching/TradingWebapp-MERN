var express = require('express');
var bodyParser = require('body-parser');
const WebSocket = require('ws');


// importing user modules
var orderUtil = require('./orderUtil.js');
var mongoUtil = require('./mongoUtil.js');
var miscUtil = require('./miscUtil.js');
var coincapApiUtil = require('./coincapApiUtil.js');
var display = require('./display.js');


const userId = 1;
var currentFiat = 1000;
var holdings = {"BTCUSD": 0};  // stores the value in its respective coin not in dollars
// shortedHolding should store the amt of BTC and also the price then
var sortedHoldings = {"BTCUSD": []}; // stores the value in its respective coin not in dollars
var jsonUserData = {"userId":userId, "currentFiat":currentFiat, "holdings":holdings, "sortedHoldings": sortedHoldings};
mongoUtil.updateUserdataToDb(jsonUserData);


orderUtil.updateOrders(); // check if previous orders was completed, updates the current Amt accordingly
coincapApiUtil.startWebsocket(); // keeps listening, helps to get current price synchronously
display.displayOrders(); // shows all order present in the database


var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: true })
// this will be run when submit is clicked, i.e any order inserted
app.post('/formData', urlencodedParser, function (req, res) {

    // websocket is still loading so dont take any order
    if(coincapApiUtil.getCurrentPrice() === undefined) {
        console.log("wait a few second for the websocket connection to start");
        // res.end() not working so had to use if else sed ;( 
        res.end("ending");
    }
    
    else {
        // jsonData i.e the order json
        var jsonData = miscUtil.addMetaData(req.body, userId, currentFiat);

        console.log(jsonData);

        mongoUtil.addOrderToDb(jsonData);
        display.displayOrders();

        var currentPrice = coincapApiUtil.getCurrentPrice();
        console.log("current price when trade happened ", coincapApiUtil.getCurrentPrice());

        // TODO: these  tradde decisions should be made in orderutil.js, buybelow/buyAbove 
        //      should have their decision and only then order is placed and current cash is reduced. 
        var buyAmtIds = ['buyNowAmt', 'buyBelowAmt', 'buyAboveAmt'];
        for(let i=0; i<buyAmtIds.length; i++) {
            if(buyAmtIds[i] in jsonData){
                currentFiat-= jsonData[buyAmtIds[i]];
                holdings["BTCUSD"] += jsonData[buyAmtIds[i]]/currentPrice;
                console.log("current cash changed to ", currentFiat);
                console.log("new btc holding ", jsonData[buyAmtIds[i]]/currentPrice);
                break;
            }
        }
        // TODO: if found in above buyAmt then skip below
        var sortAmtIds = ['sortNowAmt', 'sortBelowAmt', 'sortAboveAmt'];
        for(let i=0; i<sortAmtIds.length; i++) {
            if(sortAmtIds[i] in jsonData){
                currentFiat-= jsonData[sortAmtIds[i]];
                let temp = [jsonData[sortAmtIds[i]]/currentPrice, currentPrice];
                sortedHoldings["BTCUSD"].push(temp);
                console.log("current cash changed to ", currentFiat);
                console.log("new sorted btc holding ", jsonData[sortAmtIds[i]]/currentPrice);
                break;
            }
        }
    }
    
    res.end();
});


var port = 8080;

const server = app.listen(port, () => {
    console.log("Listening on port: " + port);
});
const io = require('socket.io')(server);


// when socket is connected start sending current price and other userMetadata to frontend
io.on('connection', (socket) => {
    // console.log('a user connected');
    
    var websocketURL = 'wss://ws.coincap.io/prices?assets=bitcoin';
    const ws = new WebSocket(websocketURL);
    ws.on('message', function incoming(data) {
        var currentPriceJson = JSON.parse(data);
        // console.log(typeof(currentPriceJson));
        let userMetadata = {"currentPrice": currentPriceJson, "currentFiat": currentFiat, holdings, sortedHoldings};
        io.emit("userMetadata", userMetadata);
        // console.log(userMetadata);
    });
});

// send/load html and javascript something 
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    res.redirect('index.html');
});
// app.listen(8080);