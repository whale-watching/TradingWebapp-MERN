/* In case of buyAt and sellAt, since our historical data isnt smooth execute order even if price is  
 * at +-0.03*price_at_that_time margin
 */
const orderCompletionMarginConst = 0.03;


const handleBuyNow = (balance, holding, order, currentPrice) => {
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

  return {
    newBalance: newBalance,
    newHolding: newHolding,
  };
};

const handleSortNow = (balance, sortedHolding, order, currentPrice) => {
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

  return {
    newBalance: newBalance,
    newSortedHolding: newSortedHolding,
  };
};

const handleSellNow = (balance, holding, sortedHolding, order) => {};

const handleBuyAt = (balance, holding, order) => {};

const handleSortAt = (balance, sortedHolding, order) => {};

const handleSellAt = (balance, holding, sortedHolding, order) => {};

module.exports = {
  handleBuyNow,
  handleSortNow,
  handleSellNow,
  handleBuyAt,
  handleSortAt,
  handleSellAt,
};
