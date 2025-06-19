const mongoose = require('mongoose');

const BudgetGoalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  period: { type: String, required: true }, // e.g. '2025-06' for June 2025
  amount: { type: Number, required: true },
  category: { type: String }, // Optional: null for global, or specific for a category
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BudgetGoal', BudgetGoalSchema);