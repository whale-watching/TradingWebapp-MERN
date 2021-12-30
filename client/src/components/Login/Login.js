import React, { useState } from "react";
import { Link, BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import HeaderComp from "../Home/HeaderComp";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login(props) {
  let navigate = useNavigate();

  const [emailLog, setEmailLog] = useState("");
  const [passwordLog, setPasswordLog] = useState("");
  const [data, setData] = useState(null);

  // To make a Login HTTP Request
  const login = async () => {
    const headers = {
      "Content-Type": "application/json",
      charset: "UTF-8",
    };

    const res = await axios({
      method: "POST",
      data: {
        email: emailLog,
        password: passwordLog,
      },
      headers: { headers },
      withCredentials: true,
      url: "/user/login",
    });

    if(res.data.success) {
      console.log("login success user data: ", res.data.user);

      // save session to local storage
      window.localStorage.setItem('userData', JSON.stringify(res.data.user));

      // redirect to /
      window.location.href = '/'; //relative to domain

    }
    
    console.log("send login axios");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(emailLog,passwordLog);
  };

  // let loginStatus = true;
  const validateUser = () => {
    //To check if a user is logged in or not.
  };

  return (
    <div className="card">
      <HeaderComp />
      <div className="center">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="txt_field">
            <input
              type="text"
              required
              onChange={(e) => {
                setEmailLog(e.target.value);
              }}
            />
            <span></span>
            <label>Email</label>
          </div>
          <div className="txt_field">
            <input
              type="password"
              required
              onChange={(e) => {
                setPasswordLog(e.target.value);
              }}
            />
            <span></span>
            <label>Password</label>
          </div>
          <div className="pass" onClick={validateUser}>
            Forgot Password?
          </div>

          <input type="submit" value="Login" onClick={login} />

          <div className="signup_link">
            Not a member?
            <Link to="/register">Signup</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
