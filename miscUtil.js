var coincapApiUtil = require("./coincapApiUtil.js");

// this fucntion runs when we are finally taking the order, so getCurrentPrice() is not undifined then
function addMetaOrderData(jsonData, userId, currentAmt) {
    // adding metaData
    jsonData["userId"] = userId;
    jsonData["orderCompleted"] = false;
    jsonData["timestamp"] = Date.now();
    jsonData["priceAtOrder"] = coincapApiUtil.getCurrentPrice();
    jsonData["crypto"] = "BITSTAMP:BTCUSD"; // manually adding for now
    return jsonData;
}

module.exports = {
    addMetaOrderData: addMetaOrderData,
};