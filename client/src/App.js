import React from 'react';
import {Route , Routes , BrowserRouter as Router} from "react-router-dom";
import Home from './components/Home/Home'
import Login from './components/Home/Login'
import './App.css';

function App() {
  
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Login />}/>
        <Route exact path="/dashboard" element={<Home />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
