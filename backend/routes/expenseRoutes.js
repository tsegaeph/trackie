const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/expenseController");

router.get("/", auth, ctrl.getExpenses);
router.post("/", auth, ctrl.addExpense);
router.put("/:id", auth, ctrl.updateExpense);
router.delete("/:id", auth, ctrl.deleteExpense);

module.exports = router;