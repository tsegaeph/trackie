import React, { createContext, useContext, useState, useEffect } from "react";

const ExpenseContext = createContext();

const CATEGORIES = [
  "Food", "Transport", "Education", "Entertainment", "Self-care", "Other"
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getPeriodStrings() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = (now.getMonth() + 1).toString().padStart(2, "0");
  const dd = now.getDate().toString().padStart(2, "0");
  const week = (() => {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  })();

  return {
    daily: `${yyyy}-${mm}-${dd}`,
    weekly: `${yyyy}-W${week}`,
    monthly: `${yyyy}-${mm}`,
  };
}

export function ExpenseProvider({ children }) {
  const [budgets, setBudgets] = useState({ daily: 0, weekly: 0, monthly: 0 });
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
    fetchBudgets();
  }, []);

  const fetchExpenses = async () => {
    const token = localStorage.getItem("authToken");
    const res = await fetch("https://trackie.onrender.com/api/expenses", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setExpenses(
        data.map((e) => ({
          ...e,
          desc: e.description,
          date: new Date(e.date),
        }))
      );
    }
  };

  const fetchBudgets = async () => {
    setLoading(true);
    const token = localStorage.getItem("authToken");
    const { daily, weekly, monthly } = getPeriodStrings();

    const [res1, res2, res3] = await Promise.all([
      fetch(`https://trackie.onrender.com/api/budgetgoals?period=${daily}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`https://trackie.onrender.com/api/budgetgoals?period=${weekly}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`https://trackie.onrender.com/api/budgetgoals?period=${monthly}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const parseAmount = async (res) => (res.ok ? (await res.json())[0]?.amount || 0 : 0);

    const dailyAmount = await parseAmount(res1);
    const weeklyAmount = await parseAmount(res2);
    const monthlyAmount = await parseAmount(res3);

    setBudgets({ daily: dailyAmount, weekly: weeklyAmount, monthly: monthlyAmount });
    setLoading(false);
  };

  const addExpense = (expense) => {
    setExpenses((prev) => [expense, ...prev]);
  };

  const updateBudgets = async (newBudgets) => {
    setLoading(true);
    const token = localStorage.getItem("authToken");
    const { daily, weekly, monthly } = getPeriodStrings();

    await Promise.all(
      ["daily", "weekly", "monthly"].map((key) =>
        fetch("https://trackie.onrender.com/api/budgetgoals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            period: { daily, weekly, monthly }[key],
            amount: newBudgets[key],
          }),
        })
      )
    );
    setBudgets(newBudgets);
    setLoading(false);
  };

  const groupByCategory = (expensesArr) => {
    const grouped = {};
    expensesArr.forEach((e) => {
      grouped[e.category] = (grouped[e.category] || 0) + e.amount;
    });
    return grouped;
  };

  const groupByDayAndCategory = (expensesArr) => {
    const grouped = {};
    expensesArr.forEach((e) => {
      const day = e.date.toISOString().slice(0, 10);
      if (!grouped[day]) grouped[day] = {};
      grouped[day][e.category] = (grouped[day][e.category] || 0) + e.amount;
    });
    return grouped;
  };

  return (
    <ExpenseContext.Provider
      value={{
        budgets,
        expenses,
        addExpense,
        updateBudgets,
        CATEGORIES,
        DAYS,
        groupByCategory,
        groupByDayAndCategory,
        loading,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenseContext() {
  return useContext(ExpenseContext);
}
