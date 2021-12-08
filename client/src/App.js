import React, { useState } from 'react';
import {Route , Routes , BrowserRouter as Router} from "react-router-dom";
import Home from './components/Home/Home'
import Login from './components/Home/Login'
import Register from './components/Home/Register'
import './App.css';

function App() {
  
  const [loggedInStatus, setloggedInStatus] = useState(false);
  const [user, setCount] = useState({});

  return (
    <Router>
    <div className="App">
      <Routes>
        <Route exact path="/" 
        element={<Login />}/>
        <Route exact path="/register" 
        element={<Register />}/>
        <Route exact path="/dashboard" element={<Home />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
