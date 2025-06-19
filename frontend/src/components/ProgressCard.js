import React from "react";
import "./ProgressCard.css";

const ProgressBar = ({ value, max, color }) => (
  <div className="progress-bar-bg">
    <div
      className="progress-bar-fg"
      style={{
        width: `${(value / max) * 100}%`,
        background: color,
      }}
    />
  </div>
);

const ProgressCard = ({ icon, label, value, max, unit, color, valueText, bgColor }) => (
  <div
    className="progress-card"
    style={{ background: bgColor }} // Use the bgColor prop
  >
    <div className="progress-card-header">
      <div className="progress-card-icon">{icon}</div>
      <span className="progress-card-label">{label}</span>
      <span className="progress-card-value">{valueText}</span>
    </div>
    <ProgressBar value={value} max={max} color={color} />
  </div>
);

export default ProgressCard;