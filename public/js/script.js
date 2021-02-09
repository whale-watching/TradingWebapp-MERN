var socket = io('http://localhost:8080');
socket.on('connect', function(){ console.log('connected to socket'); }); 

socket.on('userMetadata', function(userMetadata) {

    var currentFiat = userMetadata["currentFiat"];
    var holdingBTC = userMetadata["holdings"]["BTCUSD"];
    var currentPrice = userMetadata["currentPrice"]["bitcoin"];

    var sortedHoldingBTC = 0;
    var sortedHoldingWorth = 0;
    // itterate through all sortred orders
    for(let i=0; i<userMetadata["sortedHoldings"]["BTCUSD"].length; i++) {
        let tempValue = userMetadata["sortedHoldings"]["BTCUSD"][i][0]; // amt bought then
        let tempPriceStr = userMetadata["sortedHoldings"]["BTCUSD"][i][1]; // price at sort buy then
        let tempPrice = parseFloat(tempPriceStr);

        sortedHoldingBTC += tempValue; // total sorted holding
        sortedHoldingWorth += tempValue*tempPrice; // total sorted buy price

        // console.log(sortedHoldingBTC, sortedHoldingWorth);
    }

    var sortedHoldingWorthNow = sortedHoldingWorth + (sortedHoldingWorth-sortedHoldingBTC*currentPrice);
    document.getElementById("sortedHoldingBTC").innerHTML = sortedHoldingWorthNow;

    let totalWorth = currentFiat + holdingBTC*currentPrice + sortedHoldingWorthNow;

    document.getElementById("totalWorth").innerHTML = totalWorth;
    document.getElementById("currentFiat").innerHTML = currentFiat;
    document.getElementById("holdingBTC").innerHTML = holdingBTC;
    document.getElementById("holdingBTCWorth").innerHTML = holdingBTC*currentPrice;
    document.getElementById("sortedHoldingBTC").innerHTML = sortedHoldingBTC;
    document.getElementById("sortedHoldingBTCWorth").innerHTML = sortedHoldingWorthNow;

});