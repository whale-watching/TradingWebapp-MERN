import React from 'react'
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import './Widget.css'

function Widget(sybmol) {
  
    return (
        <div className = "widget-class">
           <TradingViewWidget 
            symbol="BINANCE:BTCUSDT" 

            width = "850"
            height = "500"

            timezone = "Asia/Kolkata"
            locale = "in"

            style = "2"
            theme={Themes.DARK}
            range = "12M"


            // toolbar_bg = "#f1f3f6"
            allow_symbol_change = {false}
            details = {true}
            studies = {["MASimple@tv-basicstudies"]}
            // hotlist = {true}
            // calendar = {true}
           />
        </div>
    )
}

export default Widget