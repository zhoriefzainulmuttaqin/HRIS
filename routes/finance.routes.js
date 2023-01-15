const express = require("express");
const router = express.Router();
const { isAuth, isSubsDiary } = require("../middleware/auth.js");
const {
    getAllRBSetting,
    addRBSetting,
    updateRBSetting,
    deleteRBSetting,
    getAllCASetting,
    addCASetting,
    updateCASetting,
    deleteCASetting,
    getAllLoanSetting,
    addLoanSetting,
    updateLoanSetting,
    deleteLoanSetting,
    getAllReimbursement,
    addReimbursement,
    updateReimbursement,
    deleteReimbursement,
    getAllCashAdvance,
    addCashAdvance,
    updateCashAdvance,
    deleteCashAdvance,
    getAllLoan,
    addLoan,
    updateLoan,
    deleteLoan,
} = require("../controllers/FinanceController.js");
const Multer = require("multer");

const Upload = Multer({ dest: "assets/" });

router.get("/reimbursement/all", isAuth, getAllReimbursement);
router.post("/reimbursement", isAuth, Upload.single("file"), addReimbursement);
router.put("/reimbursement/:id", isAuth, Upload.single("file"), updateReimbursement);
router.delete("/reimbursement/:id", isAuth, deleteReimbursement);

router.get("/reimbursement/setting/all", isAuth, getAllRBSetting);
router.post("/reimbursement/setting", isAuth, isSubsDiary, addRBSetting);
router.put("/reimbursement/setting/:id", isAuth, isSubsDiary, updateRBSetting);
router.delete("/reimbursement/setting/:id", isAuth, isSubsDiary, deleteRBSetting);

router.get("/cash-advance/all", isAuth, getAllCashAdvance);
router.post("/cash-advance", isAuth, addCashAdvance);
router.put("/cash-advance/:id", isAuth, updateCashAdvance);
router.delete("/cash-advance/:id", isAuth, deleteCashAdvance);

router.get("/cash-advance/setting/all", isAuth, getAllCASetting);
router.post("/cash-advance/setting", isAuth, isSubsDiary, addCASetting);
router.put("/cash-advance/setting/:id", isAuth, isSubsDiary, updateCASetting);
router.delete("/cash-advance/setting/:id", isAuth, isSubsDiary, deleteCASetting);

router.get("/loan/all", isAuth, getAllLoan);
router.post("/loan", isAuth, addLoan);
router.put("/loan/:id", isAuth, updateLoan);
router.delete("/loan/:id", isAuth, deleteLoan);

router.get("/loan/setting/all", isAuth, getAllLoanSetting);
router.post("/loan/setting", isAuth, isSubsDiary, addLoanSetting);
router.put("/loan/setting/:id", isAuth, isSubsDiary, updateLoanSetting);
router.delete("/loan/setting/:id", isAuth, isSubsDiary, deleteLoanSetting);

module.exports = router;
