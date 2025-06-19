const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/budgetGoalController");

router.get("/", auth, ctrl.getBudgetGoals);
router.post("/", auth, ctrl.upsertBudgetGoal);
router.delete("/:id", auth, ctrl.deleteBudgetGoal);

module.exports = router;