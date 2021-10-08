function generate10digitRandomNumber() {
    return parseInt(Math.random()*1000000000, 10)
}

class User {

    constructor() {
        this.userId = generate10digitRandomNumber();

        this.currentFiat = 1000;
        this.holdings = {"BTCUSD": 0};  // stores the value in its respective coin not in dollars
        this.sortedHoldings = {"BTCUSD": []};  // shortedHolding stores the amt of BTC and also the price when trade happened
        
    }

    
}

export default User;