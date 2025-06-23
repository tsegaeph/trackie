import React from "react";
import ExpenseForm from "../components/ExpenseForm";
import RecentExpenses from "../components/RecentExpenses";
import ExpensePieChart from "../components/ExpensePieChart";
import ExpenseLineChart from "../components/ExpenseLineChart";
import BudgetGoalCard from "../components/BudgetGoalCard";
import "../App.css";
import "./ExpenseTrackerPage.css";
import { useExpenseContext } from "../context/ExpenseContext";

export default function ExpenseTrackerPage() {
  const {
    expenses,
    budgets,
    addExpense,
    updateBudgets,
    groupByCategory,
    groupByDayAndCategory,
    CATEGORIES,
    loading,
  } = useExpenseContext();

  const pieDataObj = groupByCategory(expenses);
  const pieData = Object.entries(pieDataObj).map(([category, value]) => ({
    category,
    value,
  }));

  const lineDataObj = groupByDayAndCategory(expenses);
  const allDates = Object.keys(lineDataObj).sort();
  const lineData = allDates.map((date) => {
    const categoryValues = {};
    CATEGORIES.forEach((cat) => {
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
            loading={loading}
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
