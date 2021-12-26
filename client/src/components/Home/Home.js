import React, { Component, useState, useEffect } from "react";
import { convertNameToTradingviewSybmol } from "../../utils/nameSymbol";
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

    // console.log("\n In constr");

    // stores the current price
    this.currentPrice = {
      bitcoin: null,
      ethereum: null,
      dogecoin: null,
      tesla: null,
    };

    // default value of the state
    this.state = {
      userId: null, // random alpha numeric string of len 10
      email: null,
      name: null,

      totalAssetAmt: 1000,
      balance: 1000000000000,

      holding: {},
      sortedHolding: {},

      allOrders: [],

      coinSelectedName: "bitcoin", // default
    };

    // update the state if present in local storage else create a userId and save state to local storage

    this.userDataLocalStorage = JSON.parse(
      window.localStorage.getItem("loginData")
    );
    console.log("userdata in localStorage", this.userDataLocalStorage);
    if (this.userDataLocalStorage) {
      this.state.userId = this.userDataLocalStorage.userId;
      this.state.email = this.userDataLocalStorage.email;
      this.state.name = this.userDataLocalStorage.name;
      // this.state.userId = this.userDataLocalStorage.userId;
    }

    this.listenToUpdatedPriceWs();

    this.executePrevCompletedOrders();
  }

  // updated the this.currentPrice, user details whenever we get a new current price
  listenToUpdatedPriceWs() {

    // 1. websocket listener for bitcoin, etherium, dogecoin

    const pricesWs = new WebSocket(
      "wss://ws.coincap.io/prices?assets=bitcoin,ethereum,dogecoin"
    );
    pricesWs.onmessage = function (msg) {
      msg = JSON.parse(msg.data);
      // console.log(msg)
      if (msg.bitcoin) this.currentPrice.bitcoin = msg.bitcoin;
      if (msg.ethereum) this.currentPrice.ethereum = msg.ethereum;
      if (msg.dogecoin) this.currentPrice.dogecoin = msg.dogecoin;

      // console.log('this.current price updated to ', this.currentPrice);
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
          console.log(currPrice);
          this.currentPrice.tesla = currPrice;
        }
        catch(err) {
          console.log("err in parsing tesla websocket curr price", err);
        }
    }.bind(this));

  
    /*
    socket.addEventListener("open", function (event) {
      // socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'TSLA'}))
      socket.send(
        JSON.stringify({
          type: "subscribe",
          symbol: "TSLA",
          // symbol: "BINANCE:ETHUSDT",
        })
      );

      // Listen for messages
      socket.addEventListener(
        "message",
        function (event) {
          console.log("Message from server ", event.data);
          try {
            const currprice = JSON.parse(event.data).data[0].p;
            console.log(currprice);
            // this.setState({ currentPrice : currprice });
          } catch (err) {
            console.log(err);
          }
        }.bind(this)
      );
    });
    */
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
        type: "buyNow",
        amount: 100,
        priceAt: null, //
        orderCompleted: true,
      };
    }
    
    if(this.currentPrice[order.coinSelectedName] === null) {
      alert("Order can't be placed, current price not found for ", order.coinSelectedName);
    }
    const setCoinHandler = (coin) => {
      this.setState({ coinSelectedName: coin });
      console.log(coin);
    };

    // const setCoinHandler = (coin) => {
    //     this.setState({coinSelectedName:coin});
    //     console.log(coin);
    // }

    switch (order.type) {
      case "buyNow":
        const { newBalance, newHolding } = handleBuyNow(
          this.state.balance,
          this.state.holding,
          order,
          this.currentPrice,
        );
        this.setState({ balance: newBalance, holding: newHolding });
        break;

      case "sortNow":
        //
        break;

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

    let allOrders = this.state.allOrders;
    allOrders.push(order);
    this.setState({ allOrders });

    console.log("order are ", allOrders);
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
            placeOrder={this.placeOrder}
            onChange={(value) => this.setState({ coinSelectedName: value })}
          />
        </div>
      </div>
    );
  }
}
