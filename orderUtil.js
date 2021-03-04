var miscUtil = require("./miscUtil.js");
var mongoUtil = require("./mongoUtil.js")
var coincapApiUtil = require("./coincapApiUtil.js")

// function to update the past orders in the database if they are completed, using coincap APIs
// also updates userMetaData

function updateOrders(orderData, userMetaData, io) {

    // console.log(orderData);

    mongoUtil.addOrderToDb(orderData);
    mongoUtil.sendPastOrders(io); // it sends all past orders to frontend using socket.io

    var currentPrice = coincapApiUtil.getCurrentPrice();
    console.log("current price when trade happened ", coincapApiUtil.getCurrentPrice());

    // TODO: these  tradde decisions should be made in orderutil.js, buybelow/buyAbove 
    //      should have their decision and only then order is placed and current cash is reduced. 
    var buyAmtIds = ['buyNowAmt', 'buyAtAmt'];
    for(let i=0; i<buyAmtIds.length; i++) {
        if(buyAmtIds[i] in orderData){
            userMetaData["currentFiat"] -= orderData[buyAmtIds[i]];
            userMetaData["holdings"]["BTCUSD"] += orderData[buyAmtIds[i]]/currentPrice;
            console.log("current cash changed to ", userMetaData["currentFiat"]);
            console.log("new btc holding ", userMetaData["holdings"]["BTCUSD"]);
            break;
        }
    }
    // TODO: if found in above buyAmt then skip below
    var sortAmtIds = ['sortNowAmt', 'sortAtAmt'];
    for(let i=0; i<sortAmtIds.length; i++) {
        if(sortAmtIds[i] in orderData){
            userMetaData["currentFiat"]-= orderData[sortAmtIds[i]];
            let temp = [orderData[sortAmtIds[i]]/currentPrice, currentPrice];
            console.log(temp);
            userMetaData["sortedHoldings"]["BTCUSD"].push(temp);
            console.log("current cash changed to ", userMetaData["currentFiat"]);
            console.log("new sorted btc holding ", orderData[sortAmtIds[i]]/currentPrice);
            break;
        }
    }

    mongoUtil.updateUserdataToDb(userMetaData);
}

module.exports = {
    updateOrders: updateOrders,
};