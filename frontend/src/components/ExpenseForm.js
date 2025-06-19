import React, { useState } from "react";
import "./ExpenseForm.css";

export default function ExpenseForm({ onAdd, categories = [] }) {
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState(categories[0] || "");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!desc || !amount || isNaN(amount) || Number(amount) <= 0 || !category) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://localhost:5000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: desc,
          category,
          amount: Number(amount),
          date: new Date(),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to add expense");
      }
      const newExpense = await res.json();
      // Convert date string to Date object
      newExpense.date = new Date(newExpense.date);
      // Use the onAdd callback to update parent list
      onAdd && onAdd({
        ...newExpense,
        desc: newExpense.description, // for compatibility with RecentExpenses
      });
      setDesc("");
      setAmount("");
      setCategory(categories[0] || "");
    } catch (err) {
      alert(err.message || "An error occurred while adding expense");
    }
    setLoading(false);
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h3>Add Expense</h3>
      <input
        placeholder="e.g., Lunch, Books, etc."
        value={desc}
        onChange={e => setDesc(e.target.value)}
      />
      <select value={category} onChange={e => setCategory(e.target.value)} disabled={categories.length === 0}>
        {categories.length === 0 ? (
          <option>No categories</option>
        ) : (
          categories.map(cat => (
            <option key={cat}>{cat}</option>
          ))
        )}
      </select>
      <input
        placeholder="AED 0.00"
        type="number"
        min="0"
        step="0.01"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <button type="submit" disabled={categories.length === 0 || loading}>
        {loading ? "Adding..." : "Add Expense"}
      </button>
    </form>
  );
}