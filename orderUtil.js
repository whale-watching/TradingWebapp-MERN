var mongoUtil = require("./mongoUtil.js")
var coincapApiUtil = require("./coincapApiUtil.js")
const fetch = require("node-fetch");

var MongoClient = require('mongodb').MongoClient;
var mongoDbUrl = "mongodb://localhost:27017/mydb";

const userId = 1;

// updates currentFiat and holdingsBTC of the user and updates it in the DB
function executeOrders(orderData, userData) {

    // console.log(orderData);

    var currentPrice = coincapApiUtil.getCurrentPrice();
    console.log("current price when trade happened ", coincapApiUtil.getCurrentPrice());

    // buy now
    if('buyNowAmt' in orderData) {
        var tempAmt = orderData['buyNowAmt'];
        userData["currentFiat"] -= tempAmt;
        userData["holdings"]["BTCUSD"] += tempAmt/currentPrice;
        console.log("current cash changed to ", userData["currentFiat"]);
        console.log("new btc holding ", userData["holdings"]["BTCUSD"]);
        
        orderData["orderCompleted"] = true;
    }

    // sort now
    else if('sortNowAmt' in orderData) {
        var tempAmt = orderData['sortNowAmt'];
        userData["currentFiat"]-= tempAmt;
        let temp = [tempAmt/currentPrice, currentPrice];
        console.log(temp);
        userData["sortedHoldings"]["BTCUSD"].push(temp);
        console.log("current cash changed to ", userData["currentFiat"]);
        console.log("new sorted btc holding ", tempAmt/currentPrice);

        orderData["orderCompleted"] = true;
    }

    // if buyAtAmt and sortAtAmt call updatePrevioudOrders
    else if('buyAtAmt' in orderData || 'sortAtAmt' in orderData) {
        // updatePreviousOrders(); // can be called cause of hoisting
    }

    mongoUtil.updateUserdataToDb(userData);
}



// find the oldest order fom mongodb
// get the time it was placed,
// get historical data from coincap API after that time
async function updatePreviousOrders() {

    let currentPrice = coincapApiUtil.getCurrentPrice();

    // mongoclient init
    const client = await MongoClient.connect(mongoDbUrl, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    });
    const db = client.db('mainDb');

    // get all Past orders from database
    const allOrders = await db.collection('allOrders').find().toArray();
    // client.close();

    let firstOrderTimestamp = allOrders[0].timestamp; // get the timestamp when the fiest order was placed 



    // get user data from database
    let userData;
    const items = await db.collection('userData').find({userId : userId}).toArray();
    if(items.length) {
        userData = items[0];
        console.log("gotttttt", userData);
    } else {
        console.log("NO user data found");
    }
    client.close();



    // get historical data from coincap REST Api
    let coincapHistoricalApiUrl = 'https://api.coincap.io/v2/assets/bitcoin/history?interval=m1&start?=' + firstOrderTimestamp;

    const response = await fetch(coincapHistoricalApiUrl);
    let historicalData = await response.json();
    historicalData = historicalData['data'];
    console.log(typeof(Number(historicalData[0]['priceUsd'])));


    const marginVal = 0.03; // since we dont have continous value we check for price +- margin

    // itterate through the orders in database
    for(let i=0; i<allOrders.length; i++) {
        if(allOrders[i].orderCompleted) // false only for sortAtAmt ans buyAtAmt
            continue;
        
        // itterate through the historical data to check that price was reached
        for(let jsonIdx = 0; jsonIdx<historicalData.length; jsonIdx++) {
            
            const priceAtHistory = Number(historicalData[jsonIdx]['priceUsd']);

            // for buyAt orders
            if('buyAt' in allOrders[i]) {
                let executionPrice = allOrders[i]['buyAt'];
                let lowBoundExecutionPrice = executionPrice - executionPrice*marginVal;
                let highBoundExecutionPrice = executionPrice + executionPrice*marginVal;

                if(priceAtHistory >= lowBoundExecutionPrice && priceAtHistory<=highBoundExecutionPrice) {
                    // i.e the price came to that point, now execute order
                    var tempAmt = allOrders[i]['buyAtAmt'];
                    userData["currentFiat"] -= tempAmt;
                    userData["holdings"]["BTCUSD"] += tempAmt/currentPrice;
                    console.log("current cash changed to ", userData["currentFiat"]);
                    console.log("new btc holding ", userData["holdings"]["BTCUSD"]);
                    
                    allOrders[i]["orderCompleted"] = true;
                }
            }
            
            // for sortAt orders
            else if('sellAt' in allOrders[i]) {
                let executionPrice = allOrders[i]['sellAt'];
                let lowBoundExecutionPrice = executionPrice - executionPrice*marginVal;
                let highBoundExecutionPrice = executionPrice + executionPrice*marginVal;

                if(priceAtHistory >= lowBoundExecutionPrice && priceAtHistory<=highBoundExecutionPrice) {
                    // i.e the price came to that point, now execute order
                    var tempAmt = allOrders[i]['sortAtAmt'];
                    userData["currentFiat"]-= tempAmt;
                    let temp = [tempAmt/currentPrice, currentPrice];
                    console.log(temp);
                    userData["sortedHoldings"]["BTCUSD"].push(temp);
                    console.log("current cash changed to ", userData["currentFiat"]);
                    console.log("new sorted btc holding ", tempAmt/currentPrice);
            
                    allOrders[i]["orderCompleted"] = true;
                }
            }
        }
    }


    mongoUtil.updateUserdataToDb(userData);
}

module.exports = {
    executeOrders: executeOrders,
    updatePreviousOrders: updatePreviousOrders
};