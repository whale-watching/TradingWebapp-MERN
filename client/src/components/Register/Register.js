import React, { useState } from "react";
import axios from "axios";
import { Link, BrowserRouter as Router } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register(props) {
  let navigate = useNavigate();

  const [nameReg, setNameReg] = useState("");
  const [emailReg, setEmailReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");

  // To make a register HTTP Request
  const register = async () => {
    console.log("going to post");

    const headers = {
      "Content-Type": "application/json",
      charset: "UTF-8",
    };

    const res = await axios({
      method: "POST",
      data: {
        name: nameReg,
        email: emailReg,
        password: passwordReg,
      },
      headers: { headers },
      withCredentials: true,
      url: "/user/register",
    });
    console.log("after await res ", res);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(nameReg, emailReg, passwordReg);
  };



  return (
    <div className="card">
      <div className="center">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="txt_field">
            <input
              type="text"
              required
              onChange={(e) => {
                setNameReg(e.target.value);
              }}
            />
            <span></span>
            <label>Name</label>
          </div>

          <div className="txt_field">
            <input
              type="email"
              required
              onChange={(e) => {
                setEmailReg(e.target.value);
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
                setPasswordReg(e.target.value);
              }}
            />
            <span></span>
            <label>Password</label>
          </div>
          <div className="pass" onClick={handleSubmit}>
            Forgot Password?
          </div>
          <input type="submit" value="Register" onClick={register} />
          <div className="signup_link">
            Already a member?
            <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
