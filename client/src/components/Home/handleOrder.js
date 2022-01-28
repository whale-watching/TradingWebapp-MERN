import { showToastSuccess, showToastError } from "../../utils/toast";

/* In case of buyAt and sellAt, since our historical data isnt smooth execute order even if price is
 * at +-0.03*price_at_that_time margin
 */

const handleBuyNow = (balance, holding, order, currentPrice) => {
  if (balance - order.amount < 0) {
    showToastError(`Buy Order can't be executed not enough balance`);
    return {
      success: false,
      newBalance: balance,
      newHolding: holding,
    };
  }

  // 1. Reduce balance
  let newBalance = balance - order.amount;

  // 2. Increase holding
  let newHolding = { ...holding };

  // orderAmt / priceOfEachCoin
  let newBoughtHolding = order.amount / currentPrice[order.coinSelectedName];

  if (!newHolding[order.coinSelectedName]) {
    // first time buying that coin/stocks
    newHolding[order.coinSelectedName] = newBoughtHolding;
  } else {
    newHolding[order.coinSelectedName] += newBoughtHolding;
  }

  showToastSuccess(`Buy Order executed successfully for amount: $${order.amount}`);
  return {
    success: true,
    newBalance: newBalance,
    newHolding: newHolding,
  };
};

const handleSortNow = (balance, sortedHolding, order, currentPrice) => {
  if (balance - order.amount < 0) {
    showToastError(`Sort Order can't be executed not enough balance`);
    return {
      success: false,
      newBalance: balance,
      newSortedHolding: sortedHolding,
    };
  }

  // 1. Reduce balance
  let newBalance = balance - order.amount;

  // 2. Increase sorted holding
  let newSortedHolding = { ...sortedHolding };

  let coinBought = order.amount / currentPrice[order.coinSelectedName];
  let sortedOrder = {
    // priceWhenBought: currentPrice[order.coinSelectedName],
    amount: order.amount,
    coinBought: coinBought,
  };

  if (!newSortedHolding[order.coinSelectedName]) {
    newSortedHolding[order.coinSelectedName] = [];
    newSortedHolding[order.coinSelectedName].push(sortedOrder);
  } else {
    newSortedHolding[order.coinSelectedName].push(sortedOrder);
  }

  showToastSuccess(`Sort Order executed successfully for amount: $${order.amount}`);
  return {
    success: true,
    newBalance: newBalance,
    newSortedHolding: newSortedHolding,
  };
};

const handleSellNow = (balance, holding, sortedHolding, order, currentPrice) => {
  let newSellHolding = order.amount / currentPrice[order.coinSelectedName]; //Calculating current price of the coin to be sold.
  let newHolding = { ...holding };
  let newBalance = balance;

  if (newHolding[order.coinSelectedName] < newSellHolding) {
    showToastError(
      `Sell Order can not be placed not enough holding for ${order.coinSelectedName}`
    );
    return {
      success: false,
      newBalance: newBalance,
      newHolding: newHolding,
    };
  }

  // selling that coin/stocks
  newHolding[order.coinSelectedName] -= newSellHolding;
  newBalance = balance + order.amount;

  //If holdings are 0 delete the coin from holdings
  if (newHolding[order.coinSelectedName] == 0) {
    delete newHolding[order.coinSelectedName];
  }

  showToastSuccess(`Sell Order executed successfully for amount: $${order.amount}`);
  return {
    success: true,
    newBalance: newBalance,
    newHolding: newHolding,
  };
};

const handleSellSortNow = (balance, sortedHolding, order, currentPrice) => {

  if(currentPrice[order.coinSelectedName] < order.priceWhenOrderWasPlaced){
    window.alert("You will suffer a loss");
  }
  
  let newSellHolding = order.amount / currentPrice[order.coinSelectedName];

  let newHolding = { ...sortedHolding };

  let newBalance = balance ;

  // The profit on selling on low .

  let profit =
    order.amount * (order.priceWhenOrderWasPlaced -  currentPrice[order.coinSelectedName]);
  console.log(newHolding[order.coinSelectedName][0].coinBought);

  console.log("New Sorted" + newSellHolding);
  console.log("Profit" + profit);

  if (newHolding[order.coinSelectedName][0].coinBought >= newSellHolding) {
    // selling that coin/stocks
    newHolding[order.coinSelectedName] -= newSellHolding;
    newBalance = balance + profit;
  } else {
     window.alert("Not enough sorted holdings");
  }

  //If holdings are 0 delete the coin from holdings
  
  if (newHolding[order.coinSelectedName] == 0) {
    delete newHolding[order.coinSelectedName];
  }

  return {
    newBalance: newBalance,
    newHolding: newHolding,
  };
  console.log("inside handlesell sortt");
};

const handleBuyAt = (balance, holding, order) => {};

const handleSortAt = (balance, sortedHolding, order) => {};

const handleSellAt = (balance, holding, sortedHolding, order) => {};

export {
  handleBuyNow,
  handleSortNow,
  handleSellNow,
  handleBuyAt,
  handleSortAt,
  handleSellAt,
  handleSellSortNow,
};
