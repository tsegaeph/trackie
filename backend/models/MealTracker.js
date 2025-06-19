const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  name: { type: String, enum: ["Breakfast", "Lunch", "Dinner"], required: true },
  checked: { type: Boolean, default: false },
  note: { type: String, default: "" },
  notify: { type: Boolean, default: false }
}, { _id: false });

const mealTrackerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // 'YYYY-MM-DD'
  meals: { type: [mealSchema], default: [
    { name: "Breakfast" },
    { name: "Lunch" },
    { name: "Dinner" }
  ] },
}, { timestamps: true });

mealTrackerSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("MealTracker", mealTrackerSchema);