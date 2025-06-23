import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LoginSignup.css";
import SocialLoginButtons from "../components/SocialLoginButtons";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const response = await fetch("https://trackie.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("username", data.user?.username || username);
        navigate("/dashboard");
      } else {
        setErrorMsg(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Log In</button>
        {errorMsg && <p className="auth-error">{errorMsg}</p>}
      </form>

      <p style={{ marginTop: "1rem" }}>
        Don't have an account?{" "}
        <Link to="/signup" style={{ color: "#4187f6", textDecoration: "none" }}>
          Signup
        </Link>
      </p>
    </div>
  );
}
