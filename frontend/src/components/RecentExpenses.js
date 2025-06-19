import React from "react";
import "./RecentExpenses.css";

function groupByDate(expenses) {
  const grouped = {};
  expenses.forEach(e => {
    const date = e.date.toLocaleDateString();
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(e);
  });
  return grouped;
}

const todayStr = new Date().toLocaleDateString();

export default function RecentExpenses({ expenses }) {
  const grouped = groupByDate(expenses);
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));
  const todayTotal = expenses
    .filter(e => e.date.toLocaleDateString() === todayStr)
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="recent-expenses-card">
      <div className="recent-expenses-header">
        <h3>Recent Expenses</h3>
        <span>
          Today's Total:{" "}
          <b style={{ color: "#4187f6" }}>{todayTotal.toFixed(2)} ETB</b>
        </span>
      </div>
      <div>
        {sortedDates.length === 0 && (
          <div className="recent-expenses-empty">No expenses yet.</div>
        )}
        {sortedDates.map((date, idx) => (
          <div key={date} className="recent-expenses-group">
            <div className="recent-expenses-date">
              {date === todayStr
                ? "Today - " + date
                : idx === 1
                ? "Yesterday - " + date
                : date}
            </div>
            {grouped[date].map((e, i) => (
              <div className="recent-expense-row" key={i}>
                <div>
                  <div className="recent-expense-desc">{e.desc || e.description}</div>
                  <div className="recent-expense-cat">{e.category}</div>
                </div>
                <div className="recent-expense-amt">
                  {e.amount.toFixed(2)} ETB
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}