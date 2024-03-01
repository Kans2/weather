import React from "react";
import { useNavigate } from "react-router-dom";
import back from '../Assets/back-image.jpg';

function Login() {
  const navigate = useNavigate();

  function onSubmit() {
    navigate("/Home");
  }

  return (
    
    
       
         <div className="work">
         <h1>Welcome home!</h1>
         <img src={back} width={300} height={300} alt="hello"/>
       
          <button onClick={onSubmit} className="btn btn-primary">
            Get Started
          </button>
        
        </div>
    
  
  );
}

export default Login;
