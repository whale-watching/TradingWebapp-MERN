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

import {
	handleBuyNow,
	handleSortNow,
	handleBuyAt,
	handleSortAt,
	handleSellNow,
	handleSellAt,
} from "../components/Home/handleOrder";

import axios from "axios";

const getUpdatedTotalAssetAmt = (balance, holding, sortedHolding, currentPrice) => {

	let newTotalAssetAmt = balance;
	// console.log("total balance", newTotalAssetAmt);

	// handle holding
	for(let coinName in holding) {
		if(currentPrice[coinName]) {
			newTotalAssetAmt += holding[coinName] * currentPrice[coinName];
		}
		else {
			// console.log(`currentPrice for coin "${coinName}" was not updated yet, cant get newTotalAssetAmt `); 
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
			// console.log(`currentPrice for coin "${coinName}" was not updated yet, cant get newTotalAssetAmt `); 
			return null;
		}
	}

	return newTotalAssetAmt;
};


const dateCompare = (a,b) => {
	/*
		true if a > b;
		else false;
	*/
	// console.log("comparing ", new Date(a).getTime(), new Date(b).getTime(), new Date(a).getTime() > new Date(b).getTime());

	return new Date(a).getTime() > new Date(b).getTime();
};


// itterate through allOrders[] check if any previous order was completed
const executePrevCompletedOrders = async (allOrders, balance, holding, sortedHolding, getCurrentPrice) => {

	let newBalanceAfterCompletingPrevOrders = balance;
	let newHoldingAfterCompletingPrevOrders = holding;
	let newSortedHoldingAfterCompletingPrevOrders = sortedHolding;

	// console.log(allOrders);

	let updatedAllOrders = allOrders.slice();
	// console.log(updatedAllOrders);


    let oldestUnfinishedOrderTime = null;
	let unfinishedOrders = {};

    for (let i=0; i<updatedAllOrders.length; i++) {
		const order = updatedAllOrders[i];
		// console.log(order, order.orderCompleted, order.orderCompleted===false);
		if (order.orderCompleted === false) {
			if(!oldestUnfinishedOrderTime) {
				console.log("oldest order that was not completed", order);
				oldestUnfinishedOrderTime = order.time;
			}
			unfinishedOrders[i] = order;
		}
    }

	console.log("\n unfinished orders", unfinishedOrders);
	console.log("\n oldes unfished order", oldestUnfinishedOrderTime);

	if(oldestUnfinishedOrderTime === null) {
		console.log("No pendign orders");
		return {
			newBalance: newBalanceAfterCompletingPrevOrders,
			newHolding: newHoldingAfterCompletingPrevOrders,
			newSortedHolding: newSortedHoldingAfterCompletingPrevOrders,
			updatedAllOrders: updatedAllOrders,
		};
	}

	// testing
	// oldestUnfinishedOrderTime = 1642633200000;

    // get historical data
    const historicalDataFetchUrl = `https://api.coincap.io/v2/assets/bitcoin/history?interval=h1&start?=${oldestUnfinishedOrderTime}`;
	console.log(historicalDataFetchUrl);

	const res = await axios.get(historicalDataFetchUrl, {
		raxConfig: {
			retry: 5,
			retryDelay: 800
		}
	});
	console.log(res);
	const historicalData = res.data.data;

	console.log("data fetched", historicalData);
	console.log(typeof(oldestUnfinishedOrderTime), new Date(historicalData[0].date).getTime(), typeof(historicalData[0].date));

	// console.log(unfinishedOrders, unfinishedOrders[0]);
	for(let index in unfinishedOrders) {

		let unfinishedOrder = unfinishedOrders[index];

		for(let hisData of historicalData) {
			// console.log(hisData.priceUsd);
			if(dateCompare(hisData.date, oldestUnfinishedOrderTime)) { // hisData.time > oldestUnfinishedOrderTime

				if( (unfinishedOrder.priceWhenOrderWasPlaced >= unfinishedOrder.executeWhenPriceAt && Number(hisData.priceUsd) <= unfinishedOrder.executeWhenPriceAt) ||
					(unfinishedOrder.priceWhenOrderWasPlaced <= unfinishedOrder.executeWhenPriceAt && Number(hisData.priceUsd) >= unfinishedOrder.executeWhenPriceAt)
				) {
					console.log("\n\n price range matched", unfinishedOrder, Number(hisData.priceUsd));

					// await till the current price is defined
					//// improvement: only run for a fix time, 
					while(getCurrentPrice()[unfinishedOrder.coinSelectedName] === null) {
						console.log("current price not defined awaiting");
						await new Promise(resolve => setTimeout(resolve, 500));
					}
					// console.log("current price is defined");

				
					if(unfinishedOrder.type === "buyAt") {
						const { success, newBalance, newHolding } = handleBuyNow(
							balance,
							holding,
							unfinishedOrder,
							getCurrentPrice()
						);
						if(!success)	return;
						console.log("order was", unfinishedOrder, getCurrentPrice());
						console.log("executing buy at", newBalance, newHolding)
						newBalanceAfterCompletingPrevOrders = newBalance;
						newHoldingAfterCompletingPrevOrders = newHolding;
					}
					else if(unfinishedOrder.type === "sortAt") {
						const { success, newBalance, newSortedHolding } = handleSortNow(
							balance,
							sortedHolding,
							unfinishedOrder,
							getCurrentPrice()
						);
						if(!success)	return;
						console.log("executing sortAt", newBalance, newSortedHolding);
						newBalanceAfterCompletingPrevOrders = newBalance;
						newSortedHoldingAfterCompletingPrevOrders = newSortedHolding;
					}
					else {
						console.log("can not complete a unfinished order cause its not buyAt/sortAt", unfinishedOrder);
					}

					unfinishedOrder.orderCompleted = true;
					updatedAllOrders[index] = unfinishedOrder;
					break;
				}
			}
		}
	}

	console.log(" updatedAllOrders", updatedAllOrders);

	return {
		newBalance: newBalanceAfterCompletingPrevOrders,
		newHolding: newHoldingAfterCompletingPrevOrders,
		newSortedHolding: newSortedHoldingAfterCompletingPrevOrders,
		updatedAllOrders: updatedAllOrders,
	}
};

export {
  getUpdatedTotalAssetAmt,
  executePrevCompletedOrders,
};
