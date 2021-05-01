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


var port = 8080;
var app = express();
const server = app.listen(port, () => {
    console.log("Listening on port: " + port);
});
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('A user is connected');

    mongoUtil.sendPastOrders(io); // it sends past orders to frontend using socket.io
    sendUserData();
});

// there is only 1 user for now
const userId = 1;

var currentFiat = 1000;
var holdings = {"BTCUSD": 0};  // stores the value in its respective coin not in dollars
var sortedHoldings = {"BTCUSD": []};  // shortedHolding stores the amt of BTC and also the price when trade happened
var defaultUserData = {"userId":userId, "currentFiat":currentFiat, "holdings":holdings, "sortedHoldings": sortedHoldings};


var userData;
async function fetchUserData() {
    const client = await MongoClient.connect(mongoDbUrl, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    });
    const db = client.db('mainDb');
    // execute find query
    const items = await db.collection('userData').find({userId : userId}).toArray();
    // if user already exists
    if(items.length) {
        userData = items[0];
    }

    else {
        userData = defaultUserData;
        mongoUtil.updateUserdataToDb(userData);
    }
    console.log("user data are ", userData);

    client.close();
}
fetchUserData();



// orderUtil.updateOrders(); // check if previous orders was completed, updates the current Amt accordingly
coincapApiUtil.startWebsocket(); // keeps listening, helps to get current price synchronously


// this will be run when submit is clicked, i.e any order inserted
var urlencodedParser = bodyParser.urlencoded({ extended: true })
app.post('/formData', urlencodedParser, function (req, res) {

    // websocket is still loading so dont take any order
    if(coincapApiUtil.getCurrentPrice() === undefined) {
        console.log("wait a few second for the websocket connection to start");
        // res.end() not working so had to use if else sed ;( 
        res.end("ending");
    }
    
    else {
        async function foo() {
            let CurrentOrderData = miscUtil.addMetaOrderData(req.body, userId);
            await mongoUtil.addOrderToDb(CurrentOrderData); // await for the orders to be inserted to DB only then send them to frontend
            orderUtil.executeOrders(CurrentOrderData, userData); // execute as in reduce the current cash by amt bought, and the orders status
            mongoUtil.sendPastOrders(io);
        }
        foo();

    }
    
    res.end();
});

app.post('/resetBtn', function (req, res) {
    async function foo() {
        console.log("userMataData and pastOrders were updated to default");
        userData = defaultUserData;
        mongoUtil.updateUserdataToDb(userData);
        await mongoUtil.deletePastOrders(); // await for the pastOrders to be deleted only then send it to frontend 
        mongoUtil.sendPastOrders(io);
    }
    foo();
    res.end();
});


function sendUserData() {
    
    // connect to websocket which sends current price
    // whenever received, send it to frontend using socket.io

    var websocketURL = 'wss://ws.coincap.io/prices?assets=bitcoin';
    const ws = new WebSocket(websocketURL);

    ws.onerror = function(event) {
        console.error("WebSocket error observed ;(");
    };

    ws.on('message', function incoming(data) {
        var currentPriceJson = JSON.parse(data);
        // console.log("going ", currentPriceJson);
        let tempUserData = JSON.parse(JSON.stringify(userData)); // copying userData to tempUserData
        tempUserData["currentPrice"] = currentPriceJson;
        io.emit("userData", tempUserData);
    });
}

// send/load html and javascript something 
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    res.redirect('index.html');
});
// app.listen(8080);