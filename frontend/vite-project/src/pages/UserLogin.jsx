import React from "react";
import axios from "axios";
// use import.meta.env.VITE_BACKEND_URL directly
import { useNavigate } from "react-router-dom";


export default function UserLogin() {

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
      
            const response = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000'}/user/login`, 
              
                {
                email,
                password,
                },
                {
                    withCredentials: true,
                }      );
        
                console.log(response.data);

                navigate("/");
        }


  return (
    <div className="page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>User sign in</h2>
        <div className="auth-grid">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Enter your password" />
          </div>

          <div className="actions">
            <span className="muted">New here? <a href="/user/register">Create account</a></span>
            <button className="btn primary">Sign in</button>
          </div>
        </div>
      </form>
    </div>
  );
}
