import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import { convertNameToTradingviewSybmol } from "../../utils/nameSymbol";
import { getUpdatedTotalAssetAmt } from "../../utils/orderUtil"
import "./Home.css";
import HeaderComp from "./HeaderComp";
import Widget from "./Widget";
import BuySell from "./BuySell";

import {
  handleBuyNow,
  handleSortNow,
  handleBuyAt,
  handleSortAt,
  handleSellNow,
  handleSellAt,
} from "./handleOrder";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.lastTotalAssetChangeTimeout = null;

    // default value of the state
    this.state = {
      userId: null, // random alpha numeric string of len 10
      email: null,
      name: null,

      lastTotalAssetChange: 'none',

      totalAssetAmt: '',
      balance: 10000,

      holding: {},
      sortedHolding: {},

      allOrders: [],

      coinSelectedName: "bitcoin", // default

      currentPrice: {
        bitcoin: null,
        ethereum: null,
        dogecoin: null,
        tesla: null,
      }

    };

  }


  componentDidMount() {
    this.updateUserDataFromLocalStorage();// update the state if present in local storage else create a userId and save state to local storage
    this.quickUpdateCurrentPriceUsingApi();
    this.startUpdatingCurrentPriceUsingWebsocket();
    this.executePrevCompletedOrders();
  }

  
  componentDidUpdate(prevProps, prevState) {
    // console.log("in componentdidupdate", prevProps, prevState);

    let newTotalAssetAmt = getUpdatedTotalAssetAmt(this.state.balance, this.state.holding, this.state.sortedHolding, this.state.currentPrice);
    if(newTotalAssetAmt && this.state.totalAssetAmt !== newTotalAssetAmt) {
      // this.setState({totalAssetAmt: newTotalAssetAmt}); 
      this.state.totalAssetAmt = newTotalAssetAmt; // no setState() so as to avoid re render
      // console.log("this.state.totalAssetAmt updated to ", this.state.totalAssetAmt);
    }

    // update this.state.lastTotalAssetChange
    if(prevState.totalAssetAmt !== '') { // handle case for first time totalAssetAmt updation
      if(prevState.totalAssetAmt < this.state.totalAssetAmt) {
        // console.log("total asset increased ;) green");
        clearTimeout(this.lastTotalAssetChangeTimeout);
        this.setState({lastTotalAssetChange: 'positive'});
        // this.lastTotalAssetChange = 'positive';
        this.lastTotalAssetChangeTimeout = setTimeout(() => { this.setState({lastTotalAssetChange: 'none'}); }, 1500);
      }

      else if(prevState.totalAssetAmt > this.state.totalAssetAmt) {
        // console.log("total asset increased ;( red");
        clearTimeout(this.lastTotalAssetChangeTimeout);
        this.setState({lastTotalAssetChange: 'negative'});
        // this.lastTotalAssetChange = 'negative';
        this.lastTotalAssetChangeTimeout = setTimeout(() => { this.setState({lastTotalAssetChange: 'none'}); }, 1500);
      }
    }


    // only update the userData in the localStorage if any newOrder was placed i.e allOrders was changed
    if(JSON.stringify(prevState.allOrders) !== JSON.stringify(this.state.allOrders)) {
      let userData = {...this.state}; // all property of this.state except coinSelectedName, currentPrice
      delete userData.coinSelectedName;
      delete userData.currentPrice;
      delete userData.totalAssetAmt;

      window.localStorage.setItem("userData", JSON.stringify(userData));
      console.log(" wrote to local storage", userData);
    }

  }


  updateUserDataFromLocalStorage() {
    try {
      let userDataLocalStorage = JSON.parse(window.localStorage.getItem("userData"));
      // console.log("userdata in localStorage", userDataLocalStorage);

      if (userDataLocalStorage) {
        const {userId, email, name, balance, holding, sortedHolding, allOrders} = userDataLocalStorage;
        this.setState({userId, email, name, balance, holding, sortedHolding, allOrders});
        // console.log("updated from localStorage to ", userId, email, name, balance, holding, sortedHolding, allOrders);
      }

    }
    catch(err) {
      console.log("cant read userData from local storage",err);
      window.localStorage.setItem("userData", ""); // if some data cant be read reset.
    }

  }

  quickUpdateCurrentPriceUsingApi() {

    // bitcoin
    var config = {
      method: 'get',
      url: 'https://api.coincap.io/v2/rates/bitcoin',
      headers: { }, 
      raxConfig: {
        retry: 3,
        retryDelay: 500
      }
    };
    axios(config)
    .then(function (response) {
      // console.log('\n\n\n got bitcoin price from api', response.data.data.rateUsd);
      const price = response.data.data.rateUsd;
      let updatedCurrentPrice = {...this.state.currentPrice};
      updatedCurrentPrice.bitcoin = price;
      this.setState({currentPrice: updatedCurrentPrice});
    }.bind(this))
    .catch(function (error) {
      console.log("error updating currentPrice of bitcoin by API", error);
    });

    // ethereum
    var config = {
      method: 'get',
      url: 'https://api.coincap.io/v2/rates/ethereum',
      headers: { }, 
      raxConfig: {
        retry: 3,
        retryDelay: 500
      }
    };
    axios(config)
    .then(function (response) {
      // console.log('\n\n\n got ethereum price from api', response.data.data.rateUsd);
      const price = response.data.data.rateUsd;
      let updatedCurrentPrice = {...this.state.currentPrice};
      updatedCurrentPrice.ethereum = price;
      this.setState({currentPrice: updatedCurrentPrice});
    }.bind(this))
    .catch(function (error) {
      console.log("error updating ethereum currentPrice by API", error);
    });

    // dogecoin
    var config = {
      method: 'get',
      url: 'https://api.coincap.io/v2/rates/dogecoin',
      headers: { }, 
      raxConfig: {
        retry: 3,
        retryDelay: 500
      }
    };
    axios(config)
    .then(function (response) {
      // console.log('\n\n\n dogecoin price got from api:', response.data.data.rateUsd);
      const price = response.data.data.rateUsd;
      let updatedCurrentPrice = {...this.state.currentPrice};
      updatedCurrentPrice.dogecoin = price;
      this.setState({currentPrice: updatedCurrentPrice});
    }.bind(this))
    .catch(function (error) {
      console.log("error updating currentPrice by API", error);
    });

  }

  // updated the this.state.currentPrice, user details whenever we get a new current price
  startUpdatingCurrentPriceUsingWebsocket() {

    // 1. websocket listener for bitcoin, etherium, dogecoin

    const pricesWs = new WebSocket(
      "wss://ws.coincap.io/prices?assets=bitcoin,ethereum,dogecoin"
    );
    pricesWs.onmessage = function (msg) {
      msg = JSON.parse(msg.data);
      // console.log(msg)

      let newCurrentPrice = {...this.state.currentPrice};

      if (msg.bitcoin) newCurrentPrice.bitcoin = msg.bitcoin;
      if (msg.ethereum) newCurrentPrice.ethereum = msg.ethereum;
      if (msg.dogecoin) newCurrentPrice.dogecoin = msg.dogecoin;

      this.setState({ currentPrice : newCurrentPrice });
      // console.log('this.current price updated to ', this.state.currentPrice);
    }.bind(this);


    // 2. websocket listener for tesla

    // const socket = new WebSocket(`wss://ws.finnhub.io?token=${token}`);
    // socket.addEventListener('open', function (event) {
    //   socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'BINANCE:ETHUSDT'}))
    // });
    
    // // Listen for messages
    // socket.addEventListener('message', function (event) {
    //     // console.log('Message from server ', event.data);
    //     try {
    //       const currPrice = JSON.parse(event.data).data[0].p;
    //       // console.log(currPrice);

    //       let newCurrentPrice = {...this.state.currentPrice};
    //       newCurrentPrice.tesla = currPrice;
    //       this.setState({ currentPrice: newCurrentPrice });
    //     }
    //     catch(err) {
    //       console.log("err in parsing tesla websocket curr price", err);
    //     }
    // }.bind(this));

  }

  executePrevCompletedOrders() {
    // itterate through allOrders[] check if any previous order was completed
  }

  // called by the child class BuySell whenever user clicks on buy,sort or sell
  placeOrder = (order) => {
    // update totalAsset, holding, allOrders
    console.log("order got at Home.js", order);

    if (order === null) {
      // for testing only
      console.log("updating order to default");
      order = {
        symbol: "BINANCE:BTCUSDT",
        coinSelectedName: "bitcoin",
        type: "sortNow",
        amount: 5000,
        coinBought: 5000/this.state.currentPrice["bitcoin"],
        // executeWhenPriceAt: null, //
        orderCompleted: true,
      };
    }
    
    if(this.state.currentPrice[order.coinSelectedName] === null) {
      alert(`Order can't be placed websocket is not ready yet for the stock: ${order.coinSelectedName}`);
      return;
    }

    // const setCoinHandler = (coin) => {
    //     this.setState({coinSelectedName:coin});
    //     console.log(coin);
    // }

    switch (order.type) {
      case "buyNow": {
        const { newBalance, newHolding } = handleBuyNow(
          this.state.balance,
          this.state.holding,
          order,
          this.state.currentPrice
        );
        this.setState({ balance: newBalance, holding: newHolding });
        break;
      }

      case "sortNow": {
        order.coinBought = order.amount/this.state.currentPrice[order.coinSelectedName];
        const { newBalance, newSortedHolding } = handleSortNow(
          this.state.balance,
          this.state.sortedHolding,
          order,
          this.state.currentPrice
        );
        this.setState({ balance: newBalance, sortedHolding: newSortedHolding });
        break;
      }

      case "sellNow":
        //
        break;

      case "buyAt":
        //
        break;

      case "sortAt":
        //
        break;

      case "sellAt":
        //
        break;

      default:
        console.log("Wrong Order type");
        return;
    }

    let newAllOrders = this.state.allOrders.slice();
    newAllOrders.push(order);
    this.setState({ allOrders: newAllOrders });

    console.log("order that was added: ", order);
  };

  render() {
    return (
      <div className="Home">
        <HeaderComp />
        <div className="Content">
          <Widget coinSelectedName={this.state.coinSelectedName} />
          <BuySell
            totalAssetAmt={this.state.totalAssetAmt}
            balance={this.state.balance}
            holding={this.state.holding}
            sortedHolding={this.state.sortedHolding}
            lastTotalAssetChange={this.state.lastTotalAssetChange}
            placeOrder={this.placeOrder}
            currentPrice={this.state.currentPrice}
            coinSelectedName={this.state.coinSelectedName}
            onChange={(value) => this.setState({ coinSelectedName: value })}
          />
        </div>
      </div>
    );
  }
}
