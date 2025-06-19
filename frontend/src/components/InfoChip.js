import React from "react";
import "./InfoChip.css";

const InfoChip = ({ icon, label, mainText, color, onClick }) => {
  return (
    <div
      className={`info-chip info-chip--${color}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className="info-chip-icon">{icon}</div>
      <div className="info-chip-content">
        <span className="info-chip-label">{label}</span>
        <span className="info-chip-main">{mainText}</span>
      </div>
    </div>
  );
};

export default InfoChip;