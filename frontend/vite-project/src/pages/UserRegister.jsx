import React from "react";
import axios from "axios";
// use import.meta.env.VITE_BACKEND_URL (fallbacks added inline)
import { useNavigate } from "react-router-dom";

export default function UserRegister() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const fullName = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    // try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000'}/user/register`,
        {
          name: fullName,
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        });

      console.log(response.data);

      // ---- Store token in a cookie (accessible to JS) ----
      // Expecting token at response.data.token
    //   const token = response.data?.token;
    //   if (token) {
    //     // set cookie for 7 days (you can change expiresDays)
    //     const expiresDays = 7;
    //     const date = new Date();
    //     date.setTime(date.getTime() + expiresDays * 24 * 60 * 60 * 1000);
    //     const expires = "expires=" + date.toUTCString();

    //     // encode token in case it contains unsafe chars
    //     const safeToken = encodeURIComponent(token);

    //     // set cookie (path=/ makes it available across the site)
    //     document.cookie = `token=${safeToken}; ${expires}; path=/; SameSite=Lax`;
    //     // optionally add ; Secure when using https: document.cookie = `...; Secure`;
    //   } else {
    //     console.warn("No token found in response.data");
    //   }

      navigate("/"); }
    //    catch (err) {
//       console.error("Register error:", err?.response?.data || err.message);
//       // handle/show error as needed
//     }
//   };

  return (
    <div className="page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create user account</h2>

        <div className="auth-grid">
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" placeholder="Jane Doe" />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Enter a password" />
          </div>

          <div className="actions">
            <span className="muted">
              Already have an account? <a href="/user/login">Sign in</a>
            </span>

            <button type="submit" className="btn primary">
              Create account
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
