const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const auth = require('../middleware/authMiddleware');

// All routes require authentication
router.get('/', auth, assignmentController.getAssignments);
router.post('/', auth, assignmentController.createAssignment);
router.put('/:id', auth, assignmentController.updateAssignment);
router.delete('/:id', auth, assignmentController.deleteAssignment);

module.exports = router;