var socket = io('http://localhost:8080');
// socket.on('connect', function(){ console.log('connected to socket'); }); 

socket.on('userData', function(userData) {

    var currentFiat = userData["currentFiat"];
    var holdingBTC = userData["holdings"]["BTCUSD"];
    var currentPrice = userData["currentPrice"]["bitcoin"];

    var sortedHoldingBTC = 0;
    var sortedHoldingWorth = 0;
    // itterate through all sortred orders
    for(let i=0; i<userData["sortedHoldings"]["BTCUSD"].length; i++) {
        let tempValue = userData["sortedHoldings"]["BTCUSD"][i][0]; // amt bought then
        let tempPriceStr = userData["sortedHoldings"]["BTCUSD"][i][1]; // price at sort buy then
        let tempPrice = parseFloat(tempPriceStr);

        sortedHoldingBTC += tempValue; // total sorted holding
        sortedHoldingWorth += tempValue*tempPrice; // total sorted buy price

        // console.log(sortedHoldingBTC, sortedHoldingWorth);
    }

    var sortedHoldingWorthNow = sortedHoldingWorth + (sortedHoldingWorth-sortedHoldingBTC*currentPrice);
    document.getElementById("sortedHoldingBTC").innerHTML = sortedHoldingWorthNow;

    let totalWorth = currentFiat + holdingBTC*currentPrice + sortedHoldingWorthNow;

    document.getElementById("totalWorth").innerHTML = totalWorth.toFixed(2);
    document.getElementById("currentFiat").innerHTML = currentFiat.toFixed(2);
    document.getElementById("holdingBTC").innerHTML = holdingBTC.toFixed(8);
    document.getElementById("holdingBTCWorth").innerHTML = (holdingBTC*currentPrice).toFixed(4);
    document.getElementById("sortedHoldingBTC").innerHTML = sortedHoldingBTC.toFixed(8);
    document.getElementById("sortedHoldingBTCWorth").innerHTML = sortedHoldingWorthNow.toFixed(4);

});