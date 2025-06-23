import React, { useState, useEffect } from "react";
import "./BudgetGoalCard.css";

export default function BudgetGoalCard({ expenses, onBudgetChange, budgets, loading }) {
  const [inputs, setInputs] = useState({
    daily: budgets.daily,
    weekly: budgets.weekly,
    monthly: budgets.monthly,
  });

  useEffect(() => {
    setInputs({
      daily: budgets.daily,
      weekly: budgets.weekly,
      monthly: budgets.monthly,
    });
  }, [budgets.daily, budgets.weekly, budgets.monthly]);

  const today = new Date();

  // Helper to zero out time for accurate date comparisons
  const startOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const isSameDay = (d) => startOfDay(d).getTime() === startOfDay(today).getTime();

  // Calculate start and end of current week (Sunday to Saturday)
  const weekStart = startOfDay(new Date(today));
  weekStart.setDate(today.getDate() - today.getDay()); // Sunday

  const weekEnd = startOfDay(new Date(weekStart));
  weekEnd.setDate(weekStart.getDate() + 6); // Saturday

  const isSameWeek = (d) => {
    const date = startOfDay(d);
    return date >= weekStart && date <= weekEnd;
  };

  const isSameMonth = (d) =>
    d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();

  // Calculate total spent amounts
  const spent = {
    daily: expenses
      .filter((e) => isSameDay(new Date(e.date)))
      .reduce((sum, e) => sum + e.amount, 0),
    weekly: expenses
      .filter((e) => isSameWeek(new Date(e.date)))
      .reduce((sum, e) => sum + e.amount, 0),
    monthly: expenses
      .filter((e) => isSameMonth(new Date(e.date)))
      .reduce((sum, e) => sum + e.amount, 0),
  };

  const getPercent = (type) =>
    Math.min(100, budgets[type] ? (spent[type] / budgets[type]) * 100 : 0);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  }

  function handleSave(e) {
    e.preventDefault();
    const newBudgets = {
      daily: Number(inputs.daily) || 0,
      weekly: Number(inputs.weekly) || 0,
      monthly: Number(inputs.monthly) || 0,
    };
    onBudgetChange(newBudgets);
  }

  return (
    <div className="budget-goal-card">
      <h3>Budget Goals</h3>
      <form className="budget-goal-form" onSubmit={handleSave}>
        <div className="budget-goal-inputs">
          <div>
            <label>Daily</label>
            <input
              name="daily"
              type="number"
              min="0"
              value={inputs.daily}
              onChange={handleInputChange}
              placeholder="0"
              disabled={loading}
            />
          </div>
          <div>
            <label>Weekly</label>
            <input
              name="weekly"
              type="number"
              min="0"
              value={inputs.weekly}
              onChange={handleInputChange}
              placeholder="0"
              disabled={loading}
            />
          </div>
          <div>
            <label>Monthly</label>
            <input
              name="monthly"
              type="number"
              min="0"
              value={inputs.monthly}
              onChange={handleInputChange}
              placeholder="0"
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading}>
            Save
          </button>
        </div>
      </form>
      <div className="budget-goal-bars">
        <div className="budget-bar-label">
          <span>Week</span>
          <span>
            {spent.weekly.toFixed(2)} / {budgets.weekly} ETB
          </span>
        </div>
        <div className="budget-bar-outer">
          <div
            className="budget-bar-inner"
            style={{ height: getPercent("weekly") + "%", background: "#4187f6" }}
            title={`${spent.weekly.toFixed(2)} / ${budgets.weekly} ETB`}
          ></div>
        </div>
        <div className="budget-bar-label">
          <span>Month</span>
          <span>
            {spent.monthly.toFixed(2)} / {budgets.monthly} ETB
          </span>
        </div>
        <div className="budget-bar-outer">
          <div
            className="budget-bar-inner"
            style={{ height: getPercent("monthly") + "%", background: "#31ca7c" }}
            title={`${spent.monthly.toFixed(2)} / ${budgets.monthly} ETB`}
          ></div>
        </div>
      </div>
    </div>
  );
}
