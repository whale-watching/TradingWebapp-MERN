import React , {useState} from 'react'
import { Link, BrowserRouter as Router} from "react-router-dom";
import axios from 'axios';
import HeaderComp from './HeaderComp';
import { useNavigate } from 'react-router-dom';
import './Login.css'

 function Login(props) {
    let navigate = useNavigate(); 
    
    const [emailLog , setEmailLog] = useState("");
    const [passwordLog , setPasswordLog] = useState("");
    const [data, setData] = useState(null);
    
      // To make a Login HTTP Request
    const login = () => {
      axios({
        method: "POST",
        data: {
          username: emailLog,
          password: passwordLog,
        },
        withCredentials: true,
        url: "http://localhost:8000/login",
      }).then((res) => console.log(res));
    };

        //To get the logged in user
    const getUser = () => {
      axios({
        method: "GET",
        withCredentials: true,
        url: "http://localhost:8000/user",
      }).then((res) => {
        setData(res.data);
        console.log(res.data);
      });
    };

    const handleSubmit = e => {
        e.preventDefault();
        console.log(emailLog,passwordLog);
    };

    let loginStatus = true;
    const validateUser = () => {                 //To check if a user is logged in or not.
       if(loginStatus){
        navigate('/');                  //This is redirect the page to the home component.
       }
       else{
           console.log('user not logged in');
       }
    }
    
  return (
      
    <div className="card">
    <HeaderComp/>
    <div class="center">
    <h1>Login</h1>
    <form onSubmit={handleSubmit}>
      <div class="txt_field">
        <input 
        type="text" 
        required 
        onChange={(e)=>{
          setEmailLog(e.target.value)
      }}
        />
        <span></span>
        <label>Username</label>
      </div>
      <div class="txt_field">
        <input 
        type="password" 
        required 
        onChange={(e)=>{
          setPasswordLog(e.target.value)
      }}
        />
        <span></span>
        <label>Password</label>
      </div>
      <div class="pass" onClick={validateUser}>Forgot Password?</div>
      <input type="submit" value="Login" onClick={login}/>
      <div class="signup_link">
        Not a member? 
      <Link to='/register'>Signup</Link>
      </div>
    </form>
   </div>
    </div>
  )
}

export default Login ;