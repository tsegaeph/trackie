import React, { useEffect, useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import RecentExpenses from "../components/RecentExpenses";
import ExpensePieChart from "../components/ExpensePieChart";
import ExpenseLineChart from "../components/ExpenseLineChart";
import BudgetGoalCard from "../components/BudgetGoalCard";
import "../App.css";
import "./ExpenseTrackerPage.css";

const CATEGORIES = ["Food", "Transport", "Education",  "Entertainment", "Self-care", "Other"];

function groupByCategory(expenses) {
  const grouped = {};
  expenses.forEach(e => {
    grouped[e.category] = (grouped[e.category] || 0) + e.amount;
  });
  return grouped;
}

function groupByDayAndCategory(expenses) {
  const grouped = {};
  expenses.forEach(e => {
    const day = e.date.toISOString().slice(0, 10);
    if (!grouped[day]) grouped[day] = {};
    grouped[day][e.category] = (grouped[day][e.category] || 0) + e.amount;
  });
  return grouped;
}

// Helpers for periods
function getPeriodStrings() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = (now.getMonth() + 1).toString().padStart(2, "0");
  const dd = now.getDate().toString().padStart(2, "0");

  // Week number (ISO)
  const week = (() => {
    const d = new Date(now);
    d.setHours(0,0,0,0);
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    const yearStart = new Date(d.getFullYear(),0,1);
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
    return weekNo;
  })();

  return {
    daily: `${yyyy}-${mm}-${dd}`,
    weekly: `${yyyy}-W${week}`,
    monthly: `${yyyy}-${mm}`
  };
}

export default function ExpenseTrackerPage() {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState({ daily: 0, weekly: 0, monthly: 0 });
  const [budgetLoading, setBudgetLoading] = useState(true);

  // Fetch expenses from backend
  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://localhost:5000/api/expenses", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setExpenses(
          data.map(e => ({
            ...e,
            desc: e.description,
            date: new Date(e.date),
          }))
        );
      }
    };
    fetchExpenses();
  }, []);

  // Fetch budgets from backend
  useEffect(() => {
    const fetchBudgets = async () => {
      setBudgetLoading(true);
      const token = localStorage.getItem("authToken");
      const { daily, weekly, monthly } = getPeriodStrings();
      const res = await fetch(`http://localhost:5000/api/budgetgoals?period=${daily}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const res2 = await fetch(`http://localhost:5000/api/budgetgoals?period=${weekly}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const res3 = await fetch(`http://localhost:5000/api/budgetgoals?period=${monthly}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      let dailyAmount = 0, weeklyAmount = 0, monthlyAmount = 0;
      if (res.ok) {
        const goals = await res.json();
        if (goals[0]) dailyAmount = goals[0].amount;
      }
      if (res2.ok) {
        const goals = await res2.json();
        if (goals[0]) weeklyAmount = goals[0].amount;
      }
      if (res3.ok) {
        const goals = await res3.json();
        if (goals[0]) monthlyAmount = goals[0].amount;
      }
      setBudgets({ daily: dailyAmount, weekly: weeklyAmount, monthly: monthlyAmount });
      setBudgetLoading(false);
    };
    fetchBudgets();
  }, []);

  // Add a new expense (passed to ExpenseForm)
  const addExpense = (expense) => {
    setExpenses(prev => [expense, ...prev]);
  };

  // Save budget goals to backend
  const updateBudgets = async (newBudgets) => {
    setBudgetLoading(true);
    const token = localStorage.getItem("authToken");
    const { daily, weekly, monthly } = getPeriodStrings();
    // Save each period's budget goal
    await Promise.all([
      fetch("http://localhost:5000/api/budgetgoals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ period: daily, amount: newBudgets.daily }),
      }),
      fetch("http://localhost:5000/api/budgetgoals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ period: weekly, amount: newBudgets.weekly }),
      }),
      fetch("http://localhost:5000/api/budgetgoals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ period: monthly, amount: newBudgets.monthly }),
      }),
    ]);
    // Update local state
    setBudgets({ ...newBudgets });
    setBudgetLoading(false);
  };

  // --- Pie Chart Data: convert object to array ---
  const pieDataObj = groupByCategory(expenses);
  const pieData = Object.entries(pieDataObj).map(([category, value]) => ({
    category,
    value,
  }));

  // --- Line Chart Data: convert to array of { date, ...categoryValues } ---
  const lineDataObj = groupByDayAndCategory(expenses);
  // Get a sorted list of all dates
  const allDates = Object.keys(lineDataObj).sort();
  const lineData = allDates.map(date => {
    // For each category, default to 0 if missing
    const categoryValues = {};
    CATEGORIES.forEach(cat => {
      categoryValues[cat] = lineDataObj[date][cat] || 0;
    });
    return {
      date,
      ...categoryValues,
    };
  });

  return (
    <div className="expense-tracker-main">
      <div className="expense-tracker-row">
        <div className="budget-goal-container">
          <BudgetGoalCard
            expenses={expenses}
            onBudgetChange={updateBudgets}
            budgets={budgets}
            loading={budgetLoading}
          />
        </div>
        <div className="expense-form-container">
          <ExpenseForm categories={CATEGORIES} onAdd={addExpense} />
        </div>
        <div className="recent-expenses-container">
          <RecentExpenses expenses={expenses} />
        </div>
      </div>
      <div className="expense-tracker-charts-row">
        <ExpensePieChart data={pieData} />
        <ExpenseLineChart data={lineData} categories={CATEGORIES} />
      </div>
    </div>
  );
}