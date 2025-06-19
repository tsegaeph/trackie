const mongoose = require('mongoose');

const CellSchema = new mongoose.Schema({
  row: Number,
  col: Number,
  text: String,
  subject: String,
});

const ClassScheduleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Or remove for global
  cells: [CellSchema],   // Only store non-empty cells for efficiency
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ClassSchedule', ClassScheduleSchema);