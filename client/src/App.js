import React from 'react';
import HeaderComp from './components/HeaderComp'
import Widget from './components/Widget'
import BuySell from './components/BuySell'
import './App.css';


function App() {

  return (
    <div className="App">
      <HeaderComp />
      <div className="Content">
      <Widget />
      <BuySell />
      </div>
    </div>
  );
}

export default App;
