import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

// API base URL (use .env for deployment, fallback to localhost for dev)
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

// Utility to get today's date as YYYY-MM-DD
const getToday = () => new Date().toISOString().slice(0, 10);

// Default values for meals
const defaultMeals = [
  { name: "Breakfast", time: "6:00 AM - 9:00 AM", checked: false, notes: "", notify: false },
  { name: "Lunch", time: "12:00 PM - 2:00 PM", checked: false, notes: "", notify: false },
  { name: "Dinner", time: "6:00 PM - 9:00 PM", checked: false, notes: "", notify: false },
];

const FoodWaterContext = createContext();

export function FoodWaterProvider({ children }) {
  const [waterGoal, setWaterGoal] = useState(8);
  const [waterIntake, setWaterIntake] = useState(0);
  const [meals, setMeals] = useState(defaultMeals);
  const [mealReminders, setMealReminders] = useState(true);
  const [loading, setLoading] = useState(true);

  // Helper: get auth token
  const getToken = () => localStorage.getItem("authToken");

  // --- Load today's data on mount ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = getToken();

      // Water
      try {
        const waterRes = await fetch(`${API_BASE}/api/water/today`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (waterRes.ok) {
          const w = await waterRes.json();
          setWaterGoal(w.goal || 8);
          setWaterIntake(w.intake || 0);
        } else {
          const errText = await waterRes.text();
          console.error('Water API error:', waterRes.status, errText);
        }
      } catch (err) {
        console.error("Network error (water):", err);
      }

      // Meals
      try {
        const mealsRes = await fetch(`${API_BASE}/api/meals/today`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (mealsRes.ok) {
          const m = await mealsRes.json();
          // Map backend to frontend meal shape
          setMeals(
            (m.meals || defaultMeals).map((meal, i) => ({
              name: meal.name,
              time: defaultMeals[i]?.time || "",
              checked: meal.checked || false,
              notes: meal.note || "", // backend = note, frontend = notes
              notify: meal.notify || false,
            }))
          );
        } else {
          const errText = await mealsRes.text();
          console.error('Meals API error:', mealsRes.status, errText);
        }
      } catch (err) {
        console.error("Network error (meals):", err);
      }

      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  // --- Water actions ---
  const incrementWater = useCallback(async () => {
    const token = getToken();
    try {
      const res = await fetch(`${API_BASE}/api/water/add`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const w = await res.json();
        setWaterIntake(w.intake);
      } else {
        const errText = await res.text();
        console.error('Add water API error:', res.status, errText);
      }
    } catch (err) {
      console.error("Network error (add water):", err);
    }
  }, []);

  const decrementWater = useCallback(async () => {
    // Only local decrement; backend decrement endpoint can be added if needed.
    setWaterIntake(intake => Math.max(0, intake - 1));
  }, []);

  const updateWaterGoal = useCallback(async (goal) => {
    const token = getToken();
    try {
      const res = await fetch(`${API_BASE}/api/water/goal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ goal }),
      });
      if (res.ok) {
        const w = await res.json();
        setWaterGoal(w.goal);
        setWaterIntake(w.intake); // reset or set to backend value
      } else {
        const errText = await res.text();
        console.error('Set water goal API error:', res.status, errText);
      }
    } catch (err) {
      console.error("Network error (water goal):", err);
    }
  }, []);

  // --- Meal actions ---
  const setMealChecked = useCallback(async (index, checked) => {
    const token = getToken();
    try {
      const res = await fetch(`${API_BASE}/api/meals/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ idx: index, checked }),
      });
      if (res.ok) {
        const m = await res.json();
        setMeals(
          (m.meals || defaultMeals).map((meal, i) => ({
            name: meal.name,
            time: defaultMeals[i]?.time || "",
            checked: meal.checked || false,
            notes: meal.note || "",
            notify: meal.notify || false,
          }))
        );
      } else {
        const errText = await res.text();
        console.error('Set meal checked API error:', res.status, errText);
      }
    } catch (err) {
      console.error("Network error (set meal checked):", err);
    }
  }, []);

  const setMealNotes = useCallback(async (index, notes) => {
    const token = getToken();
    try {
      const res = await fetch(`${API_BASE}/api/meals/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ idx: index, note: notes }),
      });
      if (res.ok) {
        const m = await res.json();
        setMeals(
          (m.meals || defaultMeals).map((meal, i) => ({
            name: meal.name,
            time: defaultMeals[i]?.time || "",
            checked: meal.checked || false,
            notes: meal.note || "",
            notify: meal.notify || false,
          }))
        );
      } else {
        const errText = await res.text();
        console.error('Set meal note API error:', res.status, errText);
      }
    } catch (err) {
      console.error("Network error (set meal notes):", err);
    }
  }, []);

  // For meal reminders: still local, unless you want to save to backend
  // You can add notify field to /api/meals/update similarly

  return (
    <FoodWaterContext.Provider
      value={{
        waterGoal,
        setWaterGoal: updateWaterGoal,
        waterIntake,
        incrementWater,
        decrementWater,
        meals,
        setMealChecked,
        setMealNotes,
        mealReminders,
        setMealReminders, // local only
        loading
      }}
    >
      {children}
    </FoodWaterContext.Provider>
  );
}

export function useFoodWaterContext() {
  return useContext(FoodWaterContext);
} 