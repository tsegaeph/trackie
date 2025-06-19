const ClassSchedule = require('../models/ClassSchedule');

// Get schedule for logged-in user
exports.getSchedule = async (req, res) => {
  const schedule = await ClassSchedule.findOne({ user: req.user.id });
  res.json(schedule ? schedule.cells : []);
};

// Save/replace schedule for logged-in user
exports.saveSchedule = async (req, res) => {
  const { cells } = req.body;
  let schedule = await ClassSchedule.findOne({ user: req.user.id });
  if (!schedule) {
    schedule = new ClassSchedule({ user: req.user.id, cells });
  } else {
    schedule.cells = cells;
    schedule.updatedAt = Date.now();
  }
  await schedule.save();
  res.json({ message: 'Schedule saved' });
};