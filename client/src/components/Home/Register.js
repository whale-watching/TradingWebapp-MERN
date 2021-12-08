import React , {useState} from 'react'
import axios from 'axios';
import { Link, BrowserRouter as Router} from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import './Register.css'

 function Register(props) {
    let navigate = useNavigate(); 
    
    const [nameReg , setNameReg] = useState("");
    const [emailReg , setEmailReg] = useState("");
    const [passwordReg , setPasswordReg] = useState("");
    
    // To make a register HTTP Request
    const register = ()=>{

        // const headers = {
        //     'Content-Type': 'application/json',
        //     'charset':'UTF-8'
        // }
          axios({
            method: "POST",
            data: {
              name: nameReg,
              email:emailReg,
              password: passwordReg,
            },
            withCredentials: true,
            url: "http://localhost:8000/register",
          }).then((res) => console.log(res));
        };
    
    const handleSubmit = e => {
        e.preventDefault();
        console.log(nameReg,emailReg,passwordReg);
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
        <div class="center">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
      <div class="txt_field">
          <input 
          type="text" 
          required 
          onChange={(e)=>{
            setNameReg(e.target.value)
        }}
          />
          <span></span>
          <label>Name</label>
        </div>
         
        <div class="txt_field">
          <input 
          type="email" 
          required 
          onChange={(e)=>{
            setEmailReg(e.target.value)
        }}
          />
          <span></span>
          <label>Email</label>
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
        <input type="submit" value="Register" onClick={register}/>
        <div class="signup_link">
          Already a member? 
        <Link to='/login'>Login</Link>
        </div>
      </form>
    </div>
      </div>
    )
}

export default Register ;