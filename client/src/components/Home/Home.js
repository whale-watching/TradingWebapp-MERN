import React, { Component, useState, useEffect } from "react";
import { convertNameToTradingviewSybmol } from "../../utils/nameSymbol";
import { getUpdatedTotalAssetAmt } from "../../utils/orderUtil"
import "./Home.css";
import { token } from "../../secret.js";
import HeaderComp from "./HeaderComp";
import Widget from "./Widget";
import BuySell from "./BuySell";

import {
  handleBuyNow,
  handleBuyAt,
  handleSortNow,
  handleSortAt,
  handleSellNow,
  handleSellAt,
} from "./handleOrder";

export default class Home extends Component {
  constructor(props) {
    super(props);

    console.log("constr called");

    this.lastTotalAssetChange = 'none';
    this.lastTotalAssetChangeTimeout = null;

    
    // default value of the state
    this.state = {
      userId: null, // random alpha numeric string of len 10
      email: null,
      name: null,

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

    this.listenToUpdatedPriceWs();
    this.executePrevCompletedOrders();
  }


  componentDidMount() {
    this.updateUserDataFromLocalStorage();// update the state if present in local storage else create a userId and save state to local storage
  }

  
  componentDidUpdate(prevProps, prevState) {
    // console.log("in componentdidupdate", prevProps, prevState);

    let newTotalAssetAmt = getUpdatedTotalAssetAmt(this.state.balance, this.state.holding, this.state.sortedHolding, this.state.currentPrice);
    if(newTotalAssetAmt && this.state.totalAssetAmt !== newTotalAssetAmt) {
      // this.setState({totalAssetAmt: newTotalAssetAmt}); 
      this.state.totalAssetAmt = newTotalAssetAmt; // no setState() so as to avoid re render
      // console.log("this.state.totalAssetAmt updated to ", this.state.totalAssetAmt);
    }

    // update this.lastTotalAssetChange
    if(prevState.totalAssetAmt !== '') { // handle case for first time totalAssetAmt updation
      if(prevState.totalAssetAmt < this.state.totalAssetAmt) {
        // console.log("total asset increased ;) green");
        clearTimeout(this.lastTotalAssetChangeTimeout);
        this.lastTotalAssetChange = 'positive';
        this.lastTotalAssetChangeTimeout = setTimeout(() => { this.lastTotalAssetChange = 'none'; }, 2000);
      }

      else if(prevState.totalAssetAmt > this.state.totalAssetAmt) {
        // console.log("total asset increased ;( red");
        clearTimeout(this.lastTotalAssetChangeTimeout);
        this.lastTotalAssetChange = 'negative';
        this.lastTotalAssetChangeTimeout = setTimeout(() => { this.lastTotalAssetChange = 'none'; }, 1000);
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
      // console.log("userData got in localstorage", window.localStorage.getItem("userData"));

      let userDataLocalStorage = JSON.parse(window.localStorage.getItem("userData"));
      // console.log("userdata in localStorage", userDataLocalStorage);

      if (userDataLocalStorage) {
        // console.log("this before , \n\n", this);

        const {userId, email, name, balance, holding, sortedHolding, allOrders} = userDataLocalStorage;
        this.setState({userId, email, name, balance, holding, sortedHolding, allOrders});
        // console.log("updated from localStorage to ", userId, email, name, balance, holding, sortedHolding, allOrders);

        // this.setState({ balance: 5 }, () => {
        //   console.log("\n\n\n", this.state.balance, 'balance');
        // }); 
      }
    }
    catch(err) {
      console.log("cant read userData from local storage",err);
      window.localStorage.setItem("userData", ""); // if some data cant be read reset.
    }

  }

  // updated the this.state.currentPrice, user details whenever we get a new current price
  listenToUpdatedPriceWs() {

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

    const socket = new WebSocket(`wss://ws.finnhub.io?token=${token}`);

    socket.addEventListener('open', function (event) {
      socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'BINANCE:ETHUSDT'}))
    });
    
    // Listen for messages
    socket.addEventListener('message', function (event) {
        // console.log('Message from server ', event.data);
        try {
          const currPrice = JSON.parse(event.data).data[0].p;
          // console.log(currPrice);

          let newCurrentPrice = {...this.state.currentPrice};
          newCurrentPrice.tesla = currPrice;
          this.setState({ currPrice: newCurrentPrice });
        }
        catch(err) {
          console.log("err in parsing tesla websocket curr price", err);
        }
    }.bind(this));

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
            lastTotalAssetChange={this.lastTotalAssetChange}
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
