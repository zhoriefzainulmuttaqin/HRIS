const express = require("express");
const router = express.Router();
const { isAuth, isSubsDiary } = require("../middleware/auth.js");
const {
  // COMPONENT
  addPayrollComponent,
  getAllPayrollComponent,
  updatePayrollComponent,
  deletePayrollComponent,
  // BONUS
  addBonus,
  getBonus,
  getDetailBonus,
  deleteBonus,
  updateBonus
} = require("../controllers/PayrollController.js");

// PAYROLL COMPONENT ROUTES
router.get("/payroll-component/all", isAuth, isSubsDiary, getAllPayrollComponent);

router.post("/payroll-component", isAuth, isSubsDiary, addPayrollComponent);

router.put("/payroll-component/:id", isAuth, isSubsDiary, updatePayrollComponent);

router.delete("/payroll-component/:id", isAuth, isSubsDiary, deletePayrollComponent);

// PAYROLL BONUS
router.get("/payroll/bonus/all", isAuth, isSubsDiary, getBonus);
router.get("/payroll/bonus/detail", isAuth, isSubsDiary, getDetailBonus);
router.post("/payroll/bonus/add", isAuth, isSubsDiary, addBonus);
router.put("/payroll/bonus/put", isAuth, isSubsDiary, updateBonus);
router.delete("/payroll/bonus/delete", isAuth, isSubsDiary, deleteBonus);

module.exports = router;
