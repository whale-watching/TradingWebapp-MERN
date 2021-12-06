import React , {useState} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

 function Login(props) {
    let navigate = useNavigate(); 
    
    const [usernameReg , setUsernameReg] = useState("");
    const [passwordReg , setPasswordReg] = useState("");

    const register = ()=>{

        const headers = {
            'Content-Type': 'application/json',
            'charset':'UTF-8'
        }
        axios.post('http://localhost:8000/register',
         {     
          username: usernameReg,
          password: passwordReg,
         },
         {headers: headers}
      ).then((response)=>{
        console.log(response);
      })
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
        <div>
            <div>
            <div>
            <h1>Register</h1>
            <input 
            type="text" 
            placeholder="username"
            onChange={(e)=>{
                setUsernameReg(e.target.value);
            }}
            />
            <input 
            type="text" 
            placeholder="password"
            onChange={(e)=>{
                setPasswordReg(e.target.value);
            }}
            />
            <button  
            onClick={register}
            > 
            Register 
            </button>
            </div>

            <h1>LOGIN</h1>
            <input type="text" placeholder="username"/>
            <input type="text" placeholder="password"/>
            <button 
            onClick={validateUser}
            > 
            Login 
            </button>
            </div>
        </div>
    )
}

export default Login ;