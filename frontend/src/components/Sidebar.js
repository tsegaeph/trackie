import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import ProfileModal from "./ProfileModal";
import "./Sidebar.css";

const navLinks = [
  { label: "Home", path: "/dashboard" },
  { label: "Expense Tracker", path: "/expense-tracker" },
  { label: "Food & Water", path: "/food-water" },
  { label: "EE Tools", path: "/ee-tools" },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);

  // 🧑 Hardcoded default profile state
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    image: null, // or a placeholder image URL
  });

  return (
    <div className="sidebar">
      <div className="sidebar-logo-container">
        <img
          src="/images/sidebarpuppy.png"
          alt="Puppy Logo"
          className="sidebar-logo"
        />
        <span className="sidebar-app-name">Trackie</span>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navLinks.map((link) => (
            <li
              key={link.path}
              className={location.pathname === link.path ? "active" : ""}
              onClick={() => navigate(link.path)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") navigate(link.path);
              }}
              style={{ cursor: "pointer", userSelect: "none" }}
            >
              {link.label}
            </li>
          ))}
        </ul>
      </nav>

      <div
        className="sidebar-profile clickable"
        onClick={() => setShowProfile(true)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setShowProfile(true);
        }}
        style={{ cursor: "pointer" }}
      >
        {userProfile.image ? (
          <img
            src={userProfile.image}
            alt="Profile"
            className="sidebar-profile-icon"
            style={{ borderRadius: "50%", width: 36, height: 36 }}
          />
        ) : (
          <FaUserCircle size={36} className="sidebar-profile-icon" />
        )}
        <div>
          <div className="sidebar-profile-name">{userProfile.name}</div>
          <div className="sidebar-profile-role">Student</div>
        </div>
      </div>

      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        profileData={userProfile}
        setProfileData={setUserProfile}
      />
    </div>
  );
}

export default Sidebar;
