import React from 'react'
import { useNavigate } from 'react-router-dom';

 function Login() {
    let navigate = useNavigate();
    let loginStatus = true;
    const validateUser = (event) => {
        event.preventDefault()
       if(loginStatus){
        navigate('/dashboard');
       }
       else{
           console.log('user not logged in');
       }
    }
    
    return (
        <div>
            <input type="text" placeholder="username"/>
            <input type="text" placeholder="password"/>
            <button 
            onClick={validateUser}
            > 
            Login </button>
        </div>
    )
}

export default Login ;