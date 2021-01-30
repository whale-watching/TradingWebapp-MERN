function addMetaData(jsonData, userId, currentAmt) {
    // adding metaData
    jsonData["userId"] = userId;
    jsonData["orderCompleted"] = false;
    jsonData["timestamp"] = Date.now();
    jsonData["crypto"] = "BITSTAMP:BTCUSD"; // manually adding for now
    return jsonData;
}

module.exports = {
    addMetaData: addMetaData,
};