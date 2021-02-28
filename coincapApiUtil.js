const WebSocket = require('ws');

var currentPrice;

// start websocket to always keep listining and updating the current price.
function startWebsocket() {
    const ws = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin');
    ws.onerror = function(event) {
        console.error("WebSocket error observed in coincap trying to restart in 1s");
        setTimeout(function() {
            startWebsocket();
        }, 1000);      
    };
    ws.on('message', function incoming(data) {
        currentPrice = JSON.parse(data)["bitcoin"];
    });
}

function getCurrentPrice() {
    return currentPrice;
}


module.exports = {
    startWebsocket: startWebsocket,
    getCurrentPrice: getCurrentPrice,
};