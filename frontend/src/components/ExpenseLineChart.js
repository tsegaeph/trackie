import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./ExpenseLineChart.css";

const COLORS = [
  "#4187f6", "#31ca7c", "#fdc23e", "#f76c6c", "#9b59b6", "#ffb347", "#e67e22", "#34495e"
];

export default function ExpenseLineChart({ data, categories }) {
  // Defensive: ensure data is an array
  const lineData = Array.isArray(data) ? data : [];

  return (
    <div className="line-chart-card">
      <h4>Weekly Expense Trend</h4>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis unit=" ETB" />
          <Tooltip />
          <Legend />
          {categories.map((cat, idx) => (
            <Line
              key={cat}
              type="monotone"
              dataKey={cat}
              stroke={COLORS[idx % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}