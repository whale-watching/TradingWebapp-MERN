import React from 'react'
import TradingViewWidget from 'react-tradingview-widget';
import './Widget.css'
function Widget() {
  
    return (
        <div className = "widget-class">
           <TradingViewWidget 
           symbol="BINANCE:BTCUSDT" 
           width = "800"
           height = "500"
           timezone = "Asia/Kolkata"
           style = "2"
           locale = "in"
           toolbar_bg = "#f1f3f6"
           enable_publishing = "false"
           hide_top_toolbar =  "true"
           range= "60M"
           details = "true" 
           />
        </div>
    )
}

export default Widget