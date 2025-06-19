import React, { useRef, useState } from "react";
import EESimulatorCard from "../components/EESimulatorCard";
import EngineeringCalculatorsCard from "../components/EngineeringCalculatorsCard";
import "./EEToolsPage.css";

const EEToolsPage = () => {
  const wokwiHome = "https://wokwi.com/?embed=1";
  const [wokwiSrc, setWokwiSrc] = useState(wokwiHome);
  const iframeRef = useRef();

  // Back button: either reload main embed or use browser back
  const handleBack = () => {
    setWokwiSrc(wokwiHome);
    // Optionally, also focus the iframe so keyboard works immediately
    setTimeout(() => {
      if (iframeRef.current) iframeRef.current.focus();
    }, 500);
  };

  return (
    <div className="ee-tools-row">
      <EESimulatorCard
        src={wokwiSrc}
        onBack={handleBack}
        iframeRef={iframeRef}
      />
      <EngineeringCalculatorsCard />
    </div>
  );
};

export default EEToolsPage;