import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <img src="/images/puppy.png" alt="App Logo" className="landing-logo" />
      <h1 className="landing-title drop-title">
       {"Trackie".split("").map((char, index) => (
         <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
           {char}
         </span>
       ))}
     </h1>

       <p className="landing-slogan">Eat, spend, simulate. Engineer things your way.</p>
       <p className="landing-subtitle">Get started</p>

      <div className="landing-buttons">
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/signup")}>Sign Up</button>
      </div>
    </div>
  );
}
