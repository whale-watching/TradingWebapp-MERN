import React, { Component, useState, useEffect } from 'react';
import './Home.css';

import HeaderComp from './HeaderComp';
import Widget from './Widget';
import BuySell from './BuySell'




export default class Home extends Component {

    constructor(props) {
        super(props);

        // console.log("\n In constr");

        // default value of the state
        this.state = {
            userId: null, // random alpha numeric string of len 10
            email: null,
            name: null,

            totalAssetAmt: 1000,
            balance: 1000,

            holding: {}, 
            sortedHolding: {}, 

            allOrders: [], 

            coinSelectedName: 'bitcoin', // default
        }

        // update the state if present in local storage else create a userId and save state to local storage

        this.executePrevCompletedOrders();
    }


    componentDidMount() {

        this.listenToUpdatedPriceWs();
    }

    
    // updated the user details when ever we get the new current price 
    listenToUpdatedPriceWs() {
 
        // listening to new updated price
        const pricesWs = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum')
        pricesWs.onmessage = function (msg) {

            // updated the user details when ever we get the new current price 

            // console.log(msg.data)
        }
    }


    executePrevCompletedOrders() {
        // itterate through allOrders[] check if any previous order was completed
    }

    
    // called by the child class BuySell whenever user clicks on buy,sort or sell
    placeOrder = (order)=> {

        // update totalAsset, holding, allOrders
        console.log("at Home" , order);

        if(order === null) { // for testing only
            console.log("updating order to default");
            order = {
                sybmol: 'BINANCE:BTCUSDT', 
                type: 'buyNow', 
                amount: 100, 
                priceAt: null, // 
                orderCompleted: true, 
            }
        }

        switch(order.type) {
            case "buyNow": 
                let newBalance = this.state.balance - order.amount;
                this.setState({balance:newBalance});
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
        this.setState({allOrders});

        console.log("order are ", allOrders);

    }

    render() {
        return (
            <div className='Home'>
                <HeaderComp />
                <div className="Content">
                    <Widget 
                        coinSelectedName = {this.state.coinSelectedName}
                    />
                    <BuySell 
                        totalAssetAmt = {this.state.totalAssetAmt}
                        balance = {this.state.balance}
                        holding = {this.state.holding}
                        sortedHolding = {this.state.sortedHolding}
                        placeOrder = {this.placeOrder}
                    />
                </div>
            </div>
        )
    }

}
