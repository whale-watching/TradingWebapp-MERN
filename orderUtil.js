var miscUtil = require("./miscUtil.js");
var mongoUtil = require("./mongoUtil.js")
var coincapApiUtil = require("./coincapApiUtil.js")

// function to update the past orders in the database if they are completed, using coincap APIs
// also updates userData

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
    if('sortNowAmt' in orderData) {
        var tempAmt = orderData['sortNowAmt'];
        userData["currentFiat"]-= tempAmt;
        let temp = [tempAmt/currentPrice, currentPrice];
        console.log(temp);
        userData["sortedHoldings"]["BTCUSD"].push(temp);
        console.log("current cash changed to ", userData["currentFiat"]);
        console.log("new sorted btc holding ", tempAmt/currentPrice);

        orderData["orderCompleted"] = true;
    }

    mongoUtil.updateUserdataToDb(userData);
}

module.exports = {
    executeOrders: executeOrders,
};