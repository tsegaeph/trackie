import React from "react";
import "./EESimulatorCard.css";

const EESimulatorCard = ({ src, onBack, iframeRef }) => (
  <div className="ee-sim-card">
    <div className="ee-sim-card-header">
      <span className="ee-sim-title">Wokwi Circuit Simulator</span>
    </div>
    <iframe
      ref={iframeRef}
      title="Wokwi Circuit Simulator"
      src={src}
      width="100%"
      height="700"
      frameBorder="0"
      className="ee-sim-iframe"
      allowFullScreen
    ></iframe>
    {/* Optionally, keep these for future: */}
    {/* <div className="ee-sim-btns">
      <button className="ee-sim-btn" disabled>Save Circuit</button>
      <button className="ee-sim-btn" disabled>Load Example</button>
      <button className="ee-sim-btn" disabled>Reset</button>
    </div> */}
  </div>
);

export default EESimulatorCard;