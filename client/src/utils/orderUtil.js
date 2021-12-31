/*
allOrders = [
    id: 1, 
    currency: BTCUSDT,
    type: "BuyAt", 
    amount: 410, 
    time: 2021-3-4_4-4-5,
    whenPriceReach: 3425, 
    completed: false
]

order = {
	symbol: "BINANCE:BTCUSDT",
	coinSelectedName: "bitcoin",
	type: "sortNow",
	amount: 5000,
	priceWhenOrderWasPlaced: this.state.currentPrice("bitcoin"),
	executeWhenPriceAt: null, //
	orderCompleted: true,
}
*/

const getUpdatedTotalAssetAmt = (balance, holding, sortedHolding, currentPrice) => {

	let newTotalAssetAmt = balance;
	// console.log("total balance", newTotalAssetAmt);

	// handle holding
	for(let coinName in holding) {
		// console.log("in holding loop");
		if(currentPrice[coinName]) {
			newTotalAssetAmt += holding[coinName] * currentPrice[coinName];
		}
		else {
			console.log(`currentPrice for coin "${coinName}" was not updated yet, cant get newTotalAssetAmt `); 
			return null;
		}
	}

	// handle sortedHolding
	for(let coinName in sortedHolding) {
		if(currentPrice[coinName]) {

			// sortedHolding[coinName] is an array, itterate through all sortedHolding[coinName]
			for(let sortedHoldingOrder of sortedHolding[coinName]) {
				// worthThen + (worthThen - currentWorth) = 2*worthThen - currentWorth
				newTotalAssetAmt += 2*(sortedHoldingOrder.amount) - (sortedHoldingOrder.coinBought*currentPrice[coinName]);

				// console.log("\n", sortedHoldingOrder, sortedHoldingOrder["coinBought"], currentPrice[coinName]);
				// console.log(" ", newTotalAssetAmt);
			}
		}
		else {
			console.log(`currentPrice for coin "${coinName}" was not updated yet, cant get newTotalAssetAmt `); 
			return null;
		}
	}

	return newTotalAssetAmt;
};

const executePrevCompletedOrders = async (allOrders) => {
  //   let oldestUnfinishedOrderTime = null;
  //   for (let order of allOrders) {
  //     if (!order.completed) {
  //       oldestUnfinishedOrderTime = order.time;
  //       break;
  //     }
  //   }
  //   // convert oldestUnfinishedOrderTime to unix time?
  //   // get historical data
  //   const historicalDataFetchUrl =
  //     "https://api.coincap.io/v2/assets/bitcoin/history?interval=h1&start?=" +
  //     oldestUnfinishedOrderTime;
  //   const res = await fetch(historicalDataFetchUrl);
  //   const historicalData = res.json()["Data"];
};

module.exports = {
  getUpdatedTotalAssetAmt,
  executePrevCompletedOrders,
};
