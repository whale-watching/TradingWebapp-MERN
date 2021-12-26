const nameTradingviewSybmol = {
    bitcoin: 'BINANCE:BTCUSDT', 
    ethereum: 'BINANCE:ETHUSDT', 
    dogecoin: 'BINANCE:DOGEUSDT',
    tesla: 'NASDAQ:TSLA',
     
}

const convertNameToTradingviewSybmol = (name) => {
    
    const sybmol = nameTradingviewSybmol[name];
    if(!Symbol) {
        throw new Error("The selected name doesnt have a Tradingview sybmol!!");
    }
    return sybmol;
}

module.exports = {
    nameTradingviewSybmol,
    convertNameToTradingviewSybmol,
}