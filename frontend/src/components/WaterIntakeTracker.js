import React from "react";
import { useFoodWaterContext } from "../context/FoodWaterContext";
import "./WaterIntakeTracker.css";

export default function WaterIntakeTracker() {
  const {
    waterGoal,
    setWaterGoal,
    waterIntake,
    incrementWater,
    decrementWater,
  } = useFoodWaterContext();

  const fillPercent = waterGoal === 0 ? 0 : (waterIntake / waterGoal) * 100;

  return (
    <div className="fw-card water-tracker">
      <h3>Water Intake Tracker</h3>
      <div className="glass-visual">
        <div className="glass-outline">
          <div
            className="glass-fill"
            style={{ height: `${fillPercent}%` }}
          />
        </div>
      </div>
      <div className="water-progress">
        <span className="water-current">{waterIntake}</span>
        <span className="water-total"> of {waterGoal} cups</span>
      </div>
      <div className="water-controls">
        <button onClick={decrementWater} disabled={waterIntake === 0}>-</button>
        <button onClick={incrementWater} disabled={waterIntake === waterGoal}>+</button>
      </div>
      <div className="water-slider">
        <span>Set Daily Goal</span>
        <input
          type="range"
          min={0}
          max={8}
          value={waterGoal}
          onChange={e => setWaterGoal(Number(e.target.value))}
        />
        <span className="slider-value">{waterGoal} cups</span>
      </div>
    </div>
  );
}