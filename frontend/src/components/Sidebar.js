import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import { FaUserCircle } from "react-icons/fa";
// import ProfileModal from "./ProfileModal";
import "./Sidebar.css";

const navLinks = [
  { label: "Home", path: "/dashboard" },
  { label: "Expense Tracker", path: "/expense-tracker" },
  { label: "Food & Water", path: "/food-water" },
  { label: "EE Tools", path: "/ee-tools" },
  { label: "Trackie AI Assistant", path: "/chatbot" }
];

function Sidebar({ /* profile, updateProfile, */ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  // const [showProfile, setShowProfile] = useState(false);

  // 🧑 Hardcoded default profile state (unused now)
  // const [userProfile, setUserProfile] = useState({
  //   name: "John Doe",
  //   email: "john@example.com",
  //   image: null,
  // });

  const handleNavClick = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      onClose(); // auto close on small screens
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-logo-container">
        <img src="/images/sidebarpuppy.png" alt="Puppy Logo" className="sidebar-logo" />
        <span className="sidebar-app-name">Trackie</span>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navLinks.map((link) => (
            <li
              key={link.path}
              className={location.pathname === link.path ? "active" : ""}
              onClick={() => handleNavClick(link.path)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleNavClick(link.path);
              }}
            >
              {link.label}
            </li>
          ))}
        </ul>
      </nav>

      {/* Profile section (disabled)
      <div
        className="sidebar-profile clickable"
        onClick={() => setShowProfile(true)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setShowProfile(true);
        }}
      >
        {profile.image ? (
          <img
            src={profile.image}
            alt="Profile"
            className="sidebar-profile-icon"
            style={{ borderRadius: "50%", width: 36, height: 36 }}
          />
        ) : (
          <FaUserCircle size={36} className="sidebar-profile-icon" />
        )}
        <div>
          <div className="sidebar-profile-name">{profile.name}</div>
          <div className="sidebar-profile-role">Student</div>
        </div>
      </div>

      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        profileData={profile}
        setProfileData={updateProfile}
      />
      */}
    </div>
  );
}

export default Sidebar;
