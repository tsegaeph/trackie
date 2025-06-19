import React from "react";
import WaterIntakeTracker from "../components/WaterIntakeTracker";
import MealTracker from "../components/MealTracker";
import NutritionTips from "../components/NutritionTips";
import FoodSuggestionsSection from "../components/FoodSuggestionsSection";
import "./FoodWaterPage.css";

export default function FoodWaterPage() {
  return (
    <div className="food-water-page">
      <div className="fw-row">
        <WaterIntakeTracker />
        <MealTracker />
      </div>
      <NutritionTips />
      <FoodSuggestionsSection />
    </div>
  );
}