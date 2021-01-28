function addMetaData(jsonData, userId, currentAmt) {
    // adding metaData
    jsonData["userId"] = userId;
    jsonData["orderCompleted"] = false;
    jsonData["timestamp"] = Date.now();
    // jsonData["crypto"] = document.getElementById("cryptoSelectForm").value;
    return jsonData;
}

module.exports = {
    addMetaData: addMetaData,
};