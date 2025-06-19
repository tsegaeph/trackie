const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/mealTrackerController");

router.get("/today", auth, ctrl.getToday);
router.patch("/update", auth, ctrl.updateMeal);
router.post("/reset", auth, ctrl.resetMeals);

module.exports = router;