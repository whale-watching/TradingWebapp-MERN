import React, { Component, useState, useEffect } from 'react';
import './Home.css';




export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: null, 
            currentFiat: 0, 
            holding: {}, 
            sortedHolding: {}
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

    render() {
        return (
            <div>
                <h1>react frontend ;)</h1>
            </div>
        )
    }

}
