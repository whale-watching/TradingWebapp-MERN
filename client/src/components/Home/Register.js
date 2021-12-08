import React , {useState} from 'react'
import axios from 'axios';
import { Link, BrowserRouter as Router} from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import './Register.css'

 function Register(props) {
    let navigate = useNavigate(); 
    
    const [usernameReg , setUsernameReg] = useState("");
    const [passwordReg , setPasswordReg] = useState("");
    
    // To make a register HTTP Request
    const register = ()=>{

        const headers = {
            'Content-Type': 'application/json',
            'charset':'UTF-8'
        }
        axios.post('http://localhost:8000/api/user/register',
         {     
          userName: usernameReg,
          password: passwordReg,
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
        console.log(usernameReg,passwordReg);
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
        <div class="center">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
      <div class="txt_field">
          <input 
          type="text" 
          required 
          onChange={(e)=>{
            setUsernameReg(e.target.value)
        }}
          />
          <span></span>
          <label>Name</label>
        </div>
        <div class="txt_field">
          <input 
          type="text" 
          required 
          onChange={(e)=>{
            setUsernameReg(e.target.value)
        }}
          />
          <span></span>
          <label>Email</label>
        </div>  
        <div class="txt_field">
          <input 
          type="email" 
          required 
          onChange={(e)=>{
            setUsernameReg(e.target.value)
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
            setPasswordReg(e.target.value)
        }}
          />
          <span></span>
          <label>Password</label>
        </div>
        <div class="pass" onClick={handleSubmit}>Forgot Password?</div>
        <input type="submit" value="Login" onClick={validateUser}/>
        <div class="signup_link">
          Already a member? 
        <Link to='/'>Login</Link>
        </div>
      </form>
    </div>
      </div>
    )
}

export default Register ;