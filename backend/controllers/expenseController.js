const Expense = require("../models/Expense");

// Get all expenses for current user (optionally filter by month/category)
exports.getExpenses = async (req, res) => {
  const { month, year, category } = req.query;
  const query = { user: req.user.id };
  if (month && year) {
    // Filter by month and year (works for charting)
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    query.date = { $gte: start, $lt: end };
  }
  if (category) {
    query.category = category;
  }
  const expenses = await Expense.find(query).sort({ date: -1 });
  res.json(expenses);
};

// Add a new expense
exports.addExpense = async (req, res) => {
    try {
      const { amount, category, description, date } = req.body;
      const expense = new Expense({
        user: req.user.id,
        amount,
        category,
        description,
        date,
      });
      await expense.save();
      res.status(201).json(expense); // <-- Always send JSON
    } catch (error) {
      res.status(400).json({ message: error.message || "Error adding expense" });
    }
  };

// Edit an expense
exports.updateExpense = async (req, res) => {
  const { id } = req.params;
  const { amount, category, description, date } = req.body;
  const expense = await Expense.findOneAndUpdate(
    { _id: id, user: req.user.id },
    { amount, category, description, date },
    { new: true }
  );
  if (!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }
  res.json(expense);
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  const { id } = req.params;
  const result = await Expense.deleteOne({ _id: id, user: req.user.id });
  if (result.deletedCount === 0) {
    return res.status(404).json({ message: "Expense not found" });
  }
  res.json({ message: "Expense deleted" });
};