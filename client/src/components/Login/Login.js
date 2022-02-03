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
  const [stateId, setStateId] = useState("");
  const [data, setData] = useState(null);

  // To make a Login HTTP Request
  const login = async () => {
    const headers = {
      "Content-Type": "application/json",
      charset: "UTF-8",
    };
    console.log("Reached login");
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

    // console.log("User id in Login " + res.data.user.id);

    if(res.data.success) {
      console.log("login success user data: ", res.data.user);

       setStateId(res.data.user.id);

       console.log("ejifwef" + stateId);
       
       var data = {
         email: emailLog,
         password: passwordLog,
         id: res.data.user.id,
       };

       const resOrders = await axios({
         method: "POST",
         data: data,
         headers: { headers },
         withCredentials: true,
         url: "/user/userOrder",
       });

       if (resOrders.data.success) {
         console.log("resOrders Response " + JSON.stringify(resOrders.data.userData));
       }

      // save session to local storage
       let dataFromUser = res.data.user;
       let dataFromUserData = resOrders.data.userData[0];
       
       let user = {
         ...dataFromUser , ...dataFromUserData
       };
      window.localStorage.setItem("userData", JSON.stringify(dataFromUserData));
      // redirect to /
      window.location.href = '/'; //relative to domain

    }
    
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
