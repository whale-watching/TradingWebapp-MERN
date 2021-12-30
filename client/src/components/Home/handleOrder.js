// const currentPrice = {bitcoin: 55000};

const handleBuyNow = (balance, holding, order, currentPrice) => {
  // 1. Reduce balance
  let newBalance = balance - order.amount;

  
  // 2. Increase holding
  let newHolding = {...holding};

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
    let amtOfCurrencySorted = order.amount / currentPrice[order.coinSelectedName];
    let sortedOrder = {
        priceWhenBought: currentPrice[order.coinSelectedName], 
        amountOfCurrencySorted: amtOfCurrencySorted
    }
    
    if (! sortedHolding[order.coinSelectedName]) {
        sortedHolding[order.coinSelectedName] = [];
        sortedHolding[order.coinSelectedName].push(sortedOrder);
    }
    else {
        sortedHolding[order.coinSelectedName].push(sortedOrder);
    }

    return {
        newBalance : newBalance, 
        sortedHolding: sortedHolding
    }
}

const handleSellNow = (balance ,holding, sortedHolding, order) => {

}

const handleBuyAt = (balance ,holding, order) => {

}

const handleSortAt = (balance, sortedHolding, order) => {

}

const handleSellAt = (balance ,holding, sortedHolding, order) => {

}


module.exports = {
    handleBuyNow,
    handleSortNow, 
    handleSellNow,
    handleBuyAt, 
    handleSortAt, 
    handleSellAt
}