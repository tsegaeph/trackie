import React, { useEffect, useState } from "react";
import DashboardHeaderCard from "../components/DashboardHeaderCard";
import QuoteCard from "../components/QuoteCard";
import ProgressCard from "../components/ProgressCard";
import QuickLinksCard from "../components/QuickLinksCard";
import Footer from "../components/Footer";
import { useFoodWaterContext } from "../context/FoodWaterContext";
import TechNewsCard from "../components/TechNewsCard";
import "./DashboardPage.css";

const isSameDay = (d, today) =>
  d.getDate() === today.getDate() &&
  d.getMonth() === today.getMonth() &&
  d.getFullYear() === today.getFullYear();

function getTodayPeriodString() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = (now.getMonth() + 1).toString().padStart(2, "0");
  const dd = now.getDate().toString().padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const DashboardPage = () => {
  // --- Begin: Food & Water Progress State ---
  const {
    waterGoal,
    waterIntake,
    meals = [],
  } = useFoodWaterContext();

  const totalMeals = meals.length || 3; // fallback just in case
  const mealsCompleted = meals.filter(m => m.checked).length;
  // --- End: Food & Water Progress State ---

  // --- Begin: Expense Progress State (from backend) ---
  const [spentToday, setSpentToday] = useState(0);
  const [dailyBudget, setDailyBudget] = useState(0);

  useEffect(() => {
    const fetchExpenseProgress = async () => {
      const token = localStorage.getItem("authToken");
      const todayStr = getTodayPeriodString();

      // 1. Fetch all today's expenses
      const expensesRes = await fetch(`http://localhost:5000/api/expenses`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      let todaySpent = 0;
      if (expensesRes.ok) {
        const expenses = await expensesRes.json();
        const today = new Date();
        todaySpent = expenses
          .filter(e => {
            const date = new Date(e.date);
            return isSameDay(date, today);
          })
          .reduce((sum, e) => sum + e.amount, 0);
      }

      // 2. Fetch today's daily budget
      const budgetRes = await fetch(`http://localhost:5000/api/budgetgoals?period=${todayStr}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      let budgetAmount = 0;
      if (budgetRes.ok) {
        const goals = await budgetRes.json();
        if (goals[0]) budgetAmount = goals[0].amount;
      }
      setSpentToday(todaySpent);
      setDailyBudget(budgetAmount);
    };
    fetchExpenseProgress();
  }, []);
  // --- End: Expense Progress State (from backend) ---

  return (
    <div className="dashboard-main">
      <div className="dashboard-header-row">
        <div className="dashboard-header-card-container">
          <DashboardHeaderCard />
        </div>
        <div className="quote-card-container">
          <QuoteCard />
        </div>
      </div>
      <div className="dashboard-progress-row">
        <div className="dashboard-progress-title">Today's Progress</div>
        <div className="dashboard-progress-cards">
          <ProgressCard
            icon="💧"
            label="Water Intake"
            value={waterIntake}
            max={waterGoal || 1}
            valueText={`${waterIntake}/${waterGoal || 1} cups`}
            color="#4187f6"
            bgColor="#e8f1fd"
          />
          <ProgressCard
            icon="🍽️"
            label="Meals Today"
            value={mealsCompleted}
            max={totalMeals}
            valueText={`${mealsCompleted}/${totalMeals} meals`}
            color="#31ca7c"
            bgColor="#e7f8f2"
          />
          <ProgressCard
            icon="💳"
            label="Daily Budget"
            value={spentToday}
            max={dailyBudget}
            valueText={`${spentToday} ETB / ${dailyBudget} ETB`}
            color="#a96cf6"
            bgColor="#f7f3fd"
          />
        </div>
      </div>
      <TechNewsCard />
      <QuickLinksCard />
      <Footer />
    </div>
  );
};

export default DashboardPage;