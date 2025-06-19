const mongoose = require("mongoose");

const waterIntakeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // 'YYYY-MM-DD'
  goal: { type: Number, default: 8 },
  intake: { type: Number, default: 0 },
}, { timestamps: true });

waterIntakeSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("WaterIntake", waterIntakeSchema);