var miscUtil = require("./miscUtil.js");
var mongoUtil = require("./mongoUtil.js")
var coincapApiUtil = require("./coincapApiUtil.js")

// function to update the past orders in the database if they are completed, using coincap APIs
// also updates userData

function updateOrders(orderData, userData, io) {

    // console.log(orderData);

    mongoUtil.addOrderToDb(orderData);
    mongoUtil.sendPastOrders(io); // it sends all past orders to frontend using socket.io

    var currentPrice = coincapApiUtil.getCurrentPrice();
    console.log("current price when trade happened ", coincapApiUtil.getCurrentPrice());

    // buy now
    if('buyNowAmt' in orderData){
        var tempAmt = orderData['buyNowAmt'];
        userData["currentFiat"] -= tempAmt;
        userData["holdings"]["BTCUSD"] += tempAmt/currentPrice;
        console.log("current cash changed to ", userData["currentFiat"]);
        console.log("new btc holding ", userData["holdings"]["BTCUSD"]);        
    }

    // sort now
    if('sortNowAmt' in orderData){
        var tempAmt = orderData['sortNowAmt'];
        userData["currentFiat"]-= tempAmt;
        let temp = [tempAmt/currentPrice, currentPrice];
        console.log(temp);
        userData["sortedHoldings"]["BTCUSD"].push(temp);
        console.log("current cash changed to ", userData["currentFiat"]);
        console.log("new sorted btc holding ", tempAmt/currentPrice);
    }

    mongoUtil.updateUserdataToDb(userData);
}

module.exports = {
    updateOrders: updateOrders,
};