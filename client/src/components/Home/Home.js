import React, { Component, useState, useEffect } from 'react';
import './Home.css';

import HeaderComp from './HeaderComp';
import Widget from './Widget';
import BuySell from './BuySell'




export default class Home extends Component {

    constructor(props) {
        super(props);

        // default value of the state
        this.state = {
            userId: null, 
            username: null,
            name: null,

            totalAssetAmt: 1110,
            balance: 0,

            holding: {}, 
            sortedHolding: {}, 

            allOrders: []
        }

        // update the state if present in local storage

        // else create a userId and save state to local storage


    }


    componentDidMount() {

        this.listenToUpdatedPriceWs();
    }

    // updated the user details when ever we get the new current price 
    listenToUpdatedPriceWs() {
 
        // listening to new updated price
        const pricesWs = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum,monero,litecoin')
        pricesWs.onmessage = function (msg) {

            // updated the user details when ever we get the new current price 

            console.log(msg.data)
        }
    }

    
    // called by the child class BuySell whenever user clicks on buy,sort or sell
    placeOrder(order) {

        // update totalAsset, holding, allOrder

    }

    render() {
        return (
            <div className='Home'>
                <HeaderComp />
                <div className="Content">
                    <Widget />
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
