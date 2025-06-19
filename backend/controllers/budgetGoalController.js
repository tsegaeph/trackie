const BudgetGoal = require("../models/BudgetGoal");

// Get all goals for current user (optionally filter by period/category)
exports.getBudgetGoals = async (req, res) => {
  const { period, category } = req.query;
  const query = { user: req.user.id };
  if (period) query.period = period;
  if (category) query.category = category;
  const goals = await BudgetGoal.find(query).sort({ createdAt: -1 });
  res.json(goals);
};

// Set or update a goal (upsert for user+period+category)
exports.upsertBudgetGoal = async (req, res) => {
  const { period, amount, category } = req.body;
  if (!period || !amount) {
    return res.status(400).json({ message: "Period and amount required" });
  }
  const goal = await BudgetGoal.findOneAndUpdate(
    { user: req.user.id, period, category: category || null },
    { amount },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.json(goal);
};

// Delete a goal
exports.deleteBudgetGoal = async (req, res) => {
  const { id } = req.params;
  const result = await BudgetGoal.deleteOne({ _id: id, user: req.user.id });
  if (result.deletedCount === 0) {
    return res.status(404).json({ message: "Budget goal not found" });
  }
  res.json({ message: "Budget goal deleted" });
};