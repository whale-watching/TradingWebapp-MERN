var express = require('express');
var bodyParser = require('body-parser');
var WebSocket = require('ws');
var MongoClient = require('mongodb').MongoClient;
var mongoDbUrl = "mongodb://localhost:27017/mydb";

// importing user modules
var orderUtil = require('./orderUtil.js');
var mongoUtil = require('./mongoUtil.js');
var miscUtil = require('./miscUtil.js');
var coincapApiUtil = require('./coincapApiUtil.js');

const userId = 1;


var port = 8080;
var app = express();
const server = app.listen(port, () => {
    console.log("Listening on port: " + port);
});
const io = require('socket.io')(server);



var userMetaData;
async function fetchUserMetaData() {
    const client = await MongoClient.connect(mongoDbUrl, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    });
    const db = client.db('mainDb');
    // execute find query
    const items = await db.collection('userData').find({userId : userId}).toArray();
    // if user already exists
    if(items.length) {
        userMetaData = items[0];
    }

    else {
        var currentFiat = 1000;
        var holdings = {"BTCUSD": 0};  // stores the value in its respective coin not in dollars
        var sortedHoldings = {"BTCUSD": []};  // shortedHolding stores the amt of BTC and also the price when trade happened
        userMetaData = {"userId":userId, "currentFiat":currentFiat, "holdings":holdings, "sortedHoldings": sortedHoldings};

        mongoUtil.updateUserdataToDb(userMetaData);
    }
    console.log("user data are ", userMetaData);

    // start sending data to frontend only after we have got the userMetaData from DB
    sendUserData();

    client.close();
}
fetchUserMetaData();



orderUtil.updateOrders(); // check if previous orders was completed, updates the current Amt accordingly
coincapApiUtil.startWebsocket(); // keeps listening, helps to get current price synchronously
mongoUtil.sendPastOrders(io); // it sends order to frontend using socket.io


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
        var jsonData = miscUtil.addMetaData(req.body, userId);

        console.log(jsonData);

        mongoUtil.addOrderToDb(jsonData);
        mongoUtil.sendPastOrders(io); // it sends order to frontend using socket.io

        var currentPrice = coincapApiUtil.getCurrentPrice();
        console.log("current price when trade happened ", coincapApiUtil.getCurrentPrice());

        // TODO: these  tradde decisions should be made in orderutil.js, buybelow/buyAbove 
        //      should have their decision and only then order is placed and current cash is reduced. 
        var buyAmtIds = ['buyNowAmt', 'buyAtAmt'];
        for(let i=0; i<buyAmtIds.length; i++) {
            if(buyAmtIds[i] in jsonData){
                userMetaData["currentFiat"] -= jsonData[buyAmtIds[i]];
                userMetaData["holdings"]["BTCUSD"] += jsonData[buyAmtIds[i]]/currentPrice;
                console.log("current cash changed to ", userMetaData["currentFiat"]);
                console.log("new btc holding ", userMetaData["holdings"]["BTCUSD"]);
                break;
            }
        }
        // TODO: if found in above buyAmt then skip below
        var sortAmtIds = ['sortNowAmt', 'sortAtAmt'];
        for(let i=0; i<sortAmtIds.length; i++) {
            if(sortAmtIds[i] in jsonData){
                userMetaData["currentFiat"]-= jsonData[sortAmtIds[i]];
                let temp = [jsonData[sortAmtIds[i]]/currentPrice, currentPrice];
                console.log(temp);
                userMetaData["sortedHoldings"]["BTCUSD"].push(temp);
                console.log("current cash changed to ", userMetaData["currentFiat"]);
                console.log("new sorted btc holding ", jsonData[sortAmtIds[i]]/currentPrice);
                break;
            }
        }

        mongoUtil.updateUserdataToDb(userMetaData);
    }
    
    res.end();
});

app.post('/resetBtn', function (req, res) {
    console.log("reset button pressed");
    mongoUtil.resetPastOrders();
    res.end();
});


function sendUserData() {
    // when socket is connected start sending current price and userMetadata to frontend
    io.on('connection', (socket) => {
        console.log('a user connected');
        
        var websocketURL = 'wss://ws.coincap.io/prices?assets=bitcoin';
        const ws = new WebSocket(websocketURL);

        ws.onerror = function(event) {
            console.error("WebSocket error observed ;(");
        };

        ws.on('message', function incoming(data) {
            var currentPriceJson = JSON.parse(data);
            // console.log("going ", currentPriceJson);
            let userData = JSON.parse(JSON.stringify(userMetaData));
            userData["currentPrice"] = currentPriceJson;
            io.emit("userMetadata", userData);
        });
        
    });
}

// send/load html and javascript something 
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    res.redirect('index.html');
});
// app.listen(8080);