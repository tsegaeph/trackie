const MealTracker = require("../models/MealTracker");

// GET today's meals
exports.getToday = async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  let record = await MealTracker.findOne({ user: req.user.id, date: today });
  if (!record) {
    record = await MealTracker.create({ user: req.user.id, date: today });
  }
  res.json(record);
};

// PATCH update a meal (checked, note, notify)
exports.updateMeal = async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const { idx, checked, note, notify } = req.body; // idx: 0 = Breakfast, 1 = Lunch, 2 = Dinner
  let record = await MealTracker.findOne({ user: req.user.id, date: today });
  if (!record) {
    record = await MealTracker.create({ user: req.user.id, date: today });
  }
  if (typeof idx === "number" && record.meals[idx]) {
    if (typeof checked === "boolean") record.meals[idx].checked = checked;
    if (typeof note === "string") record.meals[idx].note = note;
    if (typeof notify === "boolean") record.meals[idx].notify = notify;
    await record.save();
  }
  res.json(record);
};

exports.resetMeals = async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  let record = await MealTracker.findOne({ user: req.user.id, date: today });
  if (record) {
    record.meals = [
      { name: "Breakfast" },
      { name: "Lunch" },
      { name: "Dinner" }
    ];
    await record.save();
  }
  res.json(record);
};