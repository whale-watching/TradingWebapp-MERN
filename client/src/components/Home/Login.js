import React , {useState} from 'react'
import { Link, BrowserRouter as Router} from "react-router-dom";
import axios from 'axios';
import HeaderComp from './HeaderComp';
import { useNavigate } from 'react-router-dom';
import './Login.css'

 function Login(props) {
    let navigate = useNavigate(); 
    
    const [usernameLog , setUsernameLog] = useState("");
    const [passwordLog , setPasswordLog] = useState("");
    
      // To make a register HTTP Request
    const register = ()=>{

        const headers = {
            'Content-Type': 'application/json',
            'charset':'UTF-8'
        }
        axios.post('http://localhost:8000/api/user/register',
         {     
          userName: usernameLog,
          password: passwordLog,
          name:"akhlas",
          email:"akhlas@gmail.com"
         },
         {headers: headers}
      ).then((response)=>{
        console.log(response);
      })
      };
    
    const handleSubmit = e => {
        e.preventDefault();
        console.log(usernameLog,passwordLog);
    };

    let loginStatus = true;
    const validateUser = () => {                 //To check if a user is logged in or not.
       if(loginStatus){
        navigate('/dashboard');                  //This is redirect the page to the home component.
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
            setUsernameLog(e.target.value)
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
        <div class="pass" onClick={handleSubmit}>Forgot Password?</div>
        <input type="submit" value="Login" onClick={validateUser}/>
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