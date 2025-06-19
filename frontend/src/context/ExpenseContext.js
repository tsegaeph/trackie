import React, { createContext, useContext, useState } from "react";

const ExpenseContext = createContext();

const CATEGORIES = [
  "Food & Drinks",
  "Education",
  "Transportation",
  "Entertainment",
  "Self Care",
  "Other"
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function ExpenseProvider({ children }) {
  const [budgets, setBudgets] = useState({
    daily: 100,
    weekly: 500,
    monthly: 2000,
  });
  const [expenses, setExpenses] = useState([]);

  const addExpense = (expense) => setExpenses((prev) => [expense, ...prev]);
  const updateBudgets = (newBudgets) => setBudgets(newBudgets);

  const groupByCategory = (expensesArr) => {
    return CATEGORIES.map(cat => ({
      category: cat,
      amount: expensesArr
        .filter(e => e.category === cat)
        .reduce((sum, e) => sum + e.amount, 0)
    })).filter(d => d.amount > 0);
  };

  const groupByDayAndCategory = (expensesArr) => {
    const dayMap = {};
    DAYS.forEach(day => {
      dayMap[day] = {};
      CATEGORIES.forEach(cat => {
        dayMap[day][cat] = 0;
      });
    });
    expensesArr.forEach(e => {
      const day = DAYS[e.date.getDay() === 0 ? 6 : e.date.getDay() - 1];
      dayMap[day][e.category] += e.amount;
    });
    return DAYS.map(day => ({
      day,
      ...dayMap[day],
    }));
  };

  return (
    <ExpenseContext.Provider value={{
      budgets, expenses, addExpense, updateBudgets,
      CATEGORIES, DAYS, groupByCategory, groupByDayAndCategory
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenseContext() {
  return useContext(ExpenseContext);
}