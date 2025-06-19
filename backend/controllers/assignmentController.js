const Assignment = require('../models/Assignment');

// Get all assignments for logged-in user
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ user: req.user.id }).sort({ dueDate: 1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new assignment
exports.createAssignment = async (req, res) => {
  const { title, dueDate, description } = req.body;
  // Only require title and dueDate!
  if (!title || !dueDate) {
    return res.status(400).json({ message: 'title and dueDate are required' });
  }
  try {
    const assignment = new Assignment({
      user: req.user.id,
      title,
      dueDate,
      description,
    });
    await assignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an assignment
exports.updateAssignment = async (req, res) => {
  const { id } = req.params;
  try {
    const assignment = await Assignment.findOne({ _id: id, user: req.user.id });
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    Object.assign(assignment, req.body);
    await assignment.save();
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an assignment
exports.deleteAssignment = async (req, res) => {
  const { id } = req.params;
  try {
    const assignment = await Assignment.findOneAndDelete({ _id: id, user: req.user.id });
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json({ message: 'Assignment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};