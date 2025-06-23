import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase"; // Adjust path if needed
import { useNavigate } from "react-router-dom";
import "./SocialLoginButtons.css";

export default function SocialLoginButtons() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ✅ Save user info or token (optional but useful)
      localStorage.setItem("authToken", await user.getIdToken());
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userName", user.displayName || "");

      // ✅ Navigate to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error("Google Sign-In failed:", error);
      alert("Google login failed. Please try again.");
    }
  };

  return (
    <div className="social-login">
      <p>Or continue with</p>
      <button className="google-button" onClick={handleGoogleLogin}>
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google icon"
        />
        Continue with Google
      </button>
    </div>
  );
}
