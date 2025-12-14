import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FoodPartnerRegister() {

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.company.value;
    const email = e.target.email.value;
    const password = e.target.password.value; 

    const response = await axios.post(
      "http://localhost:3000/foodPartner/register",
      {
        name: name,
        email: email,
        password: password
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
        <h2>Food partner register</h2>

        <div className="auth-grid">

          <div className="field">
            <label htmlFor="company">Company name</label>
            <input id="company" name="company" placeholder="Acme Foods" />
          </div>

          <div className="field">
            <label htmlFor="email">Contact email</label>
            <input id="email" name="email" type="email" placeholder="contact@acme.com" />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Create a password" />
          </div>

          <div className="actions">
            <span className="muted">Already registered? <a href="/foodPartner/login">Sign in</a></span>
            <button type="submit" className="btn primary">Create account</button>
          </div>

        </div>
      </form>
    </div>
  );
}
