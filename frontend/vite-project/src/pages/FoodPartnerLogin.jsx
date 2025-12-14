import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FoodPartnerLogin() {

const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    // Implement login logic here, e.g., send a request to the backend
    const response = await axios.post(
      "http://localhost:3000/foodPartner/login", 
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }      
    );  
    console.log(response.data);
    navigate("/create-food");
    
  };



  return (
    <div className="page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Food partner sign in</h2>
        <div className="auth-grid">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="contact@acme.com" />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Enter your password" />
          </div>

          <div className="actions">
            <span className="muted">Need an account? <a href="/foodPartner/register">Create one</a></span>
            <button className="btn primary">Sign in</button>
          </div>
        </div>
      </form>
    </div>
  );
}
