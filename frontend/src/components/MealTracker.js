import React from "react";
import { useFoodWaterContext } from "../context/FoodWaterContext";
import "./MealTracker.css";

export default function MealTracker() {
  const { meals, setMealChecked, setMealNotes, mealReminders, setMealReminders } = useFoodWaterContext();

  return (
    <div className="fw-card meal-tracker">
      <h3>Meal Tracker</h3>
      <ul className="meal-list">
        {meals.map((meal, i) => (
          <li key={meal.name} className={`meal-item ${meal.checked ? "checked" : ""}`}>
            <div className="meal-info">
              <span className="meal-icon">{i === 0 ? "🌞" : i === 1 ? "🍴" : "🌙"}</span>
              <div>
                <div className="meal-title">{meal.name}</div>
                <div className="meal-time">{meal.time}</div>
                {meal.notes && (
                  <div className="meal-notes">{meal.notes}</div>
                )}
              </div>
              <input
                type="checkbox"
                checked={meal.checked}
                onChange={e => setMealChecked(i, e.target.checked)}
              />
            </div>
            <input
              className="meal-notes-input"
              placeholder="Add notes..."
              value={meal.notes}
              onChange={e => setMealNotes(i, e.target.value)}
            />
          </li>
        ))}
      </ul>
      <div className="reminder-toggle">
        <span>Meal Reminders</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={mealReminders}
            onChange={e => setMealReminders(e.target.checked)}
          />
          <span className="slider"></span>
        </label>
        <span className="reminder-desc">
          Get notifications when it's time for your meals
        </span>
      </div>
    </div>
  );
}