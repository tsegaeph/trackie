import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import "./ExpensePieChart.css";

const COLORS = [
  "#4187f6", "#31ca7c", "#fdc23e", "#f76c6c", "#9b59b6", "#ffb347", "#e67e22", "#34495e"
];

export default function ExpensePieChart({ data }) {
  // Defensive: ensure data is an array
  const pieData = Array.isArray(data) ? data : [];

  return (
    <div className="pie-chart-card">
      <h4>Expense Categories</h4>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={40}
            fill="#8884d8"
            label
          >
            {pieData.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}