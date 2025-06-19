import React from "react";
import "./SocialLoginButtons.css"; // Optional styling

export default function SocialLoginButtons() {
  const handleGoogleLogin = () => {
    alert("Google login coming soon!"); // Replace with actual auth logic later
  };

  return (
    <div className="social-login">
      <p>Or continue with</p>
      <button className="google-button" onClick={handleGoogleLogin}>
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google icon" />
        Continue with Google
      </button>
    </div>
  );
}
