const WaterIntake = require("../models/WaterIntake");

// GET today's water intake & goal
exports.getToday = async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  let record = await WaterIntake.findOne({ user: req.user.id, date: today });
  if (!record) {
    record = await WaterIntake.create({ user: req.user.id, date: today });
  }
  res.json(record);
};

// POST/PUT set goal or update intake
exports.setGoal = async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const { goal } = req.body;
  let record = await WaterIntake.findOneAndUpdate(
    { user: req.user.id, date: today },
    { $set: { goal } },
    { new: true, upsert: true }
  );
  res.json(record);
};

exports.addCup = async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  let record = await WaterIntake.findOne({ user: req.user.id, date: today });
  if (!record) {
    record = await WaterIntake.create({ user: req.user.id, date: today });
  }
  if (record.intake < record.goal) {
    record.intake += 1;
    await record.save();
  }
  res.json(record);
};

exports.resetIntake = async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  let record = await WaterIntake.findOneAndUpdate(
    { user: req.user.id, date: today },
    { $set: { intake: 0 } },
    { new: true }
  );
  res.json(record);
};