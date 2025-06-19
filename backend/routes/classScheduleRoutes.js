const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/classScheduleController');

router.get('/', auth, ctrl.getSchedule);
router.post('/', auth, ctrl.saveSchedule);

module.exports = router;