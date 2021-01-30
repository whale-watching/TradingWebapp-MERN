var display = require('./display.js');
const WebSocket = require('ws');

// start websocket to keep listining to curretn price, BTCUSD
function startWebsocket() {
    const ws = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin');
    ws.on('message', function incoming(data) {
        var currentPriceBTC = data;
        console.log(currentPriceBTC);
        display.updateCurrentPrice(currentPriceBTC);
    });
}


module.exports = {
    startWebsocket: startWebsocket,
};