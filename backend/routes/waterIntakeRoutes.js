const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/waterIntakeController");

router.get("/today", auth, ctrl.getToday);
router.post("/goal", auth, ctrl.setGoal);
router.post("/add", auth, ctrl.addCup);
router.post("/reset", auth, ctrl.resetIntake);

module.exports = router;