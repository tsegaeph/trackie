import React from "react";
import "./NutritionTips.css";

export default function NutritionTips() {
  return (
    <div className="fw-card nutrition-tips">
      <div className="tip brain-foods">
        <div className="tip-title">🧠 Brain Foods</div>
        <div className="tip-desc">
          Eat foods rich in omega-3 fatty acids like fish, walnuts, and flaxseeds to boost brain function during study sessions.
        </div>
      </div>
      <div className="tip regular-meals">
        <div className="tip-title">⏰ Regular Meals</div>
        <div className="tip-desc">
          Don't skip meals, especially breakfast. Regular eating maintains blood sugar levels and helps with concentration.
        </div>
      </div>
      <div className="tip hydration">
        <div className="tip-title">💧 Hydration</div>
        <div className="tip-desc">
          Even mild dehydration can affect cognitive performance. Aim for 8 cups of water daily to stay focused and alert.
        </div>
      </div>
    </div>
  );
}