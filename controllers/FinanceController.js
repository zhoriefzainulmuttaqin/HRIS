const { RBSetting, CASetting, LoanSetting, Reimbursement, CashAdvance, Loan } = require("../models/FinanceModels.js")
const Employee = require("../models/Employee.js")
const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");
const db = require("../config/database.js");
const { JobPosition } = require("../models/JobModels.js");
const ReportTo = require("../models/ReportTo.js");

const getAllRBSetting = async (req, res) => {
    try {
      const result = await RBSetting.findAll({
        where: {
            unique_id: req.userData.unique_id,
        }
      });
      return res.jsonData(result);
    } catch (err) {
      return res.serverError("Internal server error: " + err.toString());
    }
  };
  
const addRBSetting = async (req, res) => {
    try {
      const result = await RBSetting.create({
        name: req.body.name,
        limit_amount: req.body.limit_amount,
        min_next_claim: req.body.min_next_claim,
        assign_to: req.body.assign_to,
        unique_id: req.userData.unique_id,
      });
  
      return res.jsonSuccessCreated("Success create RBSetting");
    } catch (err) {
      return res.serverError("Internal server error: " + err.toString());
    }
  };
  
const deleteRBSetting = async (req, res) => {
    try {
      const result = await RBSetting.destroy({
        where: {
          id: req.params.id,
        },
      });
      return res.jsonSuccess("Success delete RBSetting");
    } catch (err) {
      return res.serverError("Internal server error: " + err.toString());
    }
  };
  
const updateRBSetting = async (req, res) => {
    try {
      const result = await RBSetting.update(
        {
            name: req.body.name,
            limit_amount: req.body.limit_amount,
            min_next_claim: req.body.min_next_claim,
            assign_to: req.body.assign_to,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
  
      return res.jsonSuccess("Success update RBSetting");
    } catch (err) {
      return res.serverError("Internal server error: " + err.toString());
    }
};

const getAllCASetting = async (req, res) => {
    try {
      const result = await CASetting.findAll({
        where: {
            unique_id: req.userData.unique_id,
        }
      });
      return res.jsonData(result);
    } catch (err) {
      return res.serverError("Internal server error: " + err.toString());
    }
  };
  
const addCASetting = async (req, res) => {
    try {
      const result = await CASetting.create({
        name: req.body.name,
        limit_amount: req.body.limit_amount,
        settlement_due: req.body.settlement_due,
        assign_to: req.body.assign_to,
        unique_id: req.userData.unique_id,
      });
  
      return res.jsonSuccessCreated("Success create CASetting");
    } catch (err) {
      return res.serverError("Internal server error: " + err.toString());
    }
  };
  
const deleteCASetting = async (req, res) => {
    try {
      const result = await CASetting.destroy({
        where: {
          id: req.params.id,
        },
      });
      return res.jsonSuccess("Success delete CASetting");
    } catch (err) {
      return res.serverError("Internal server error: " + err.toString());
    }
  };
  
const updateCASetting = async (req, res) => {
    try {
      const result = await CASetting.update(
        {
            name: req.body.name,
            limit_amount: req.body.limit_amount,
            settlement_due: req.body.settlement_due,
            assign_to: req.body.assign_to,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
  
      return res.jsonSuccess("Success update CASetting");
    } catch (err) {
      return res.serverError("Internal server error: " + err.toString());
    }
};

const getAllLoanSetting = async (req, res) => {
    try {
      const result = await LoanSetting.findAll({
        where: {
            unique_id: req.userData.unique_id,
        }
      });
      return res.jsonData(result);
    } catch (err) {
      return res.serverError("Internal server error: " + err.toString());
    }
  };
  
const addLoanSetting = async (req, res) => {
    try {
      const result = await LoanSetting.create({
        name: req.body.name,
        max_installment: req.body.max_installment,
        interest: req.body.interest,
        unique_id: req.userData.unique_id,
      });
  
      return res.jsonSuccessCreated("Success create LoanSetting");
    } catch (err) {
      return res.serverError("Internal server error: " + err.toString());
    }
  };
  
const deleteLoanSetting = async (req, res) => {
    try {
      const result = await LoanSetting.destroy({
        where: {
          id: req.params.id,
        },
      });
      return res.jsonSuccess("Success delete LoanSetting");
    } catch (err) {
      return res.serverError("Internal server error: " + err.toString());
    }
  };
  
const updateLoanSetting = async (req, res) => {
    try {
      const result = await LoanSetting.update(
        {
          name: req.body.name,
          max_installment: req.body.max_installment,
          interest: req.body.interest,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
  
      return res.jsonSuccess("Success update LoanSetting");
    } catch (err) {
      return res.serverError("Internal server error: " + err.toString());
    }
};

const getAllReimbursement = async (req, res) => {
    try {
      let result;

      if(req.query.keyword) {
        result = await Reimbursement.findAll({
          where: {
              unique_id: req.userData.unique_id,
          },
          include: [{
              model: Employee,
              as: "employee",
              attributes: ["id", "firstName"],
              where: {
                [Op.or]: [
                  {
                    firstName: {
                      [Op.like]: `%${req.query.keyword}%`
                    }
                  }
                ]
              }
          }, {
            model: RBSetting,
            as: "reimbursement_setting",
            // where: {
            //   [Op.or]: [
            //     {
            //       name: {
            //         [Op.like]: `%${req.query.keyword}%`
            //       }
            //     }
            //   ]
            // }
          }]
        });
      } else if(req.query.id) {
        result = await Reimbursement.findByPk(req.query.id, {
          include: [
            {
              model: Employee,
              as: "employee",
              attributes: ["id", "firstName"]
          }, {
            model: RBSetting,
            as: "reimbursement_setting"
          }
          ]
        })
        if (result.file != null || result.file != undefined) {
          result.file = `${req.protocol}://${req.get('host')}/assets/finance/${result.file}`
        }
      }
      else {
        result = await Reimbursement.findAll({
          where: {
              unique_id: req.userData.unique_id,
          },
          include: [{
              model: Employee,
              as: "employee",
              attributes: ["id", "firstName"]
          }, {
            model: RBSetting,
            as: "reimbursement_setting"
          }]
        });
      }

      result.map(res => {
        if(res.file != null) {
          res.file = `${req.protocol}://${req.get('host')}/assets/finance/${res.file}`
        }else {
          res.file = null
        }
      })
      return res.jsonData(result);
    } catch (err) {
      return res.serverError("Internal server error: " + err.toString());
    }
  };
  
const addReimbursement = async (req, res) => {
    try {
      let file = null;

      if (req.file) {
        const tempPath = req.file.path;
        file =
          req.file.filename + "." + req.file.mimetype.split("/")[1];
        const targetPath = path.join(`assets/finance/${file}`);
        fs.rename(tempPath, targetPath, (err) => {
          if (err) return handleError(err, res);
        });
      }

      const result = await Reimbursement.create({
        employeeId: req.body.employeeId,
        reimbursement_setting_id: req.body.reimbursement_setting_id,
        amount: req.body.amount,
        use_date: req.body.use_date,
        note: req.body.note,
        file: file,
        unique_id: req.userData.unique_id
      });

      const spv = await ReportTo.findAll({
        where: {
          employeeId: req.body.employeeId
        },
        attributes: ["id", "employeeId", "reportToEmployee"],
        raw: true,
        nest: true,
      });
  
      if(spv && spv.length > 0) {
        spv.map(async (sp) => {
          await pushInbox({
            unique_id: req.userData.unique_id,
            to_employee: sp.reportToEmployee,
            employeeId: req.body.employeeId,
            title: "New Finance Reimbursment Request",
            link: "/inbox/approval-list",
            type: "approval"
          })
        })
      }
  
      return res.jsonSuccessCreated("Success create Reimbursement");
    } catch (err) {
      return res.serverError("Internal server error: " + err.toString());
    }
  };
  
const deleteReimbursement = async (req, res) => {
    try {
      const result = await Reimbursement.destroy({
        where: {
          id: req.params.id,
        },
      });
      return res.jsonSuccess("Success delete Reimbursement");
    } catch (err) {
      return res.serverError("Internal server error: " + err.toString());
    }
  };
  
const updateReimbursement = async (req, res) => {
    try {
      const findData = await Reimbursement.findByPk(req.params.id)
      let file = findData.file;
      
      if (req.file) {
        fs.unlink(`assets/finance/${findData.file}`, (err) => {
          if (err) throw err;
          console.log("path/file.txt was deleted");
        });
        const tempPath = req.file.path;
        file =
          req.file.filename + "." + req.file.mimetype.split("/")[1];
        const targetPath = path.join(`assets/finance/${file}`);
        fs.rename(tempPath, targetPath, (err) => {
          if (err) return handleError(err, res);
        });
      }

      const result = await Reimbursement.update(
        {
            employeeId: req.body.employeeId,
            reimbursement_setting_id: req.body.reimbursement_setting_id,
            amount: req.body.amount,
            use_date: req.body.use_date,
            note: req.body.note,
            file: file,
            status: req.body.status,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
  
      return res.jsonSuccess("Success update Reimbursement");
    } catch (err) {
      return res.serverError("Internal server error: " + err.toString());
    }
};

const getAllCashAdvance = async (req, res) => {
    try {
      let result;

      if(req.query.keyword) {
        result = await CashAdvance.findAll({
          where: {
              unique_id: req.userData.unique_id,
          },
          include: [{
              model: Employee,
              as: "employee",
              attributes: ["id", "firstName"],
              where: {
                [Op.or]: [
                  {
                    firstName: {
                      [Op.like]: `%${req.query.keyword}%`
                    }
                  }
                ]
              }
          }, {
            model: CASetting,
            as: "cash_setting"
          }]
        });
      }else if(req.query.id) {
        result = await CashAdvance.findByPk(req.query.id, {
          include: [{
            model: Employee,
            as: "employee",
            attributes: ["id", "firstName"]
        }, {
          model: CASetting,
          as: "cash_setting"
        }]
        })
      }
      else {
        result = await CashAdvance.findAll({
          where: {
              unique_id: req.userData.unique_id,
          },
          include: [{
              model: Employee,
              as: "employee",
              attributes: ["id", "firstName"]
          }, {
            model: CASetting,
            as: "cash_setting"
          }]
        });
      }

      return res.jsonData(result);
    } catch (err) {
      return res.serverError("Internal server error: " + err.toString());
    }
  };
  
const addCashAdvance = async (req, res) => {
    try {
      const result = await CashAdvance.create({
            employeeId: req.body.employeeId,
            cash_advance_setting_id: req.body.cash_advance_setting_id,
            amount: req.body.amount,
            use_date: req.body.use_date,
            request_date: req.body.request_date,
            note: req.body.note,
            unique_id: req.userData.unique_id
      });

      const spv = await ReportTo.findAll({
        where: {
          employeeId: req.body.employeeId
        },
        attributes: ["id", "employeeId", "reportToEmployee"],
        raw: true,
        nest: true,
      });
  
      if(spv && spv.length > 0) {
        spv.map(async (sp) => {
          await pushInbox({
            unique_id: req.userData.unique_id,
            to_employee: sp.reportToEmployee,
            employeeId: req.body.employeeId,
            title: "New Finance Cash Advance Request",
            link: "/inbox/approval-list",
            type: "approval"
          })
        })
      }
  
      return res.jsonSuccessCreated("Success create CashAdvance");
    } catch (err) {
      return res.serverError("Internal server error: " + err.toString());
    }
  };
  
const deleteCashAdvance = async (req, res) => {
    try {
      const result = await CashAdvance.destroy({
        where: {
          id: req.params.id,
        },
      });
      return res.jsonSuccess("Success delete CashAdvance");
    } catch (err) {
      return res.serverError("Internal server error: " + err.toString());
    }
  };
  
const updateCashAdvance = async (req, res) => {
    try {
      const result = await CashAdvance.update(
        {
            employeeId: req.body.employeeId,
            cash_advance_setting_id: req.body.cash_advance_setting_id,
            amount: req.body.amount,
            use_date: req.body.use_date,
            request_date: req.body.request_date,
            note: req.body.note,
            status: req.body.status,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
  
      return res.jsonSuccess("Success update CashAdvance");
    } catch (err) {
      return res.serverError("Internal server error: " + err.toString());
    }
};

const getAllLoan = async (req, res) => {
    try {
      let result;

      if(req.query.keyword) {
        result = await Loan.findAll({
          where: {
              unique_id: req.userData.unique_id,
          },
          include: [{
              model: Employee,
              as: "employee",
              attributes: ["id", "firstName"],
              where: {
                [Op.or]: [
                  {
                    firstName: {
                      [Op.like]: `%${req.query.keyword}%`
                    }
                  }
                ]
              }
          }, {
            model: LoanSetting,
            as: "loan_setting"
          }]
        });
      }else if(req.query.id) {
        result = await Loan.findByPk(req.query.id, {
          include: [{
            model: Employee,
            as: "employee",
            attributes: ["id", "firstName"]
        }, {
          model: LoanSetting,
          as: "loan_setting"
        }]
        })
      }
      else {
        result = await Loan.findAll({
          where: {
              unique_id: req.userData.unique_id,
          },
          include: [{
              model: Employee,
              as: "employee",
              attributes: ["id", "firstName"]
          }, {
            model: LoanSetting,
            as: "loan_setting"
          }]
        });
      }

      return res.jsonData(result);
    } catch (err) {
      return res.serverError("Internal server error: " + err.toString());
    }
  };
  
const addLoan = async (req, res) => {
    try {
      const result = await Loan.create({
        employeeId: req.body.employeeId,
        loan_setting_id: req.body.loan_setting_id,
        amount: req.body.amount,
        interest: req.body.interest,
        note: req.body.note,
        max_installment: req.body.max_installment,
        unique_id: req.userData.unique_id,
      });

      const spv = await ReportTo.findAll({
        where: {
          employeeId: req.body.employeeId
        },
        attributes: ["id", "employeeId", "reportToEmployee"],
        raw: true,
        nest: true,
      });
  
      if(spv && spv.length > 0) {
        spv.map(async (sp) => {
          await pushInbox({
            unique_id: req.userData.unique_id,
            to_employee: sp.reportToEmployee,
            employeeId: req.body.employeeId,
            title: "New Finance Loan Request",
            link: "/inbox/approval-list",
            type: "approval"
          })
        })
      }
  
      return res.jsonSuccessCreated("Success create Loan");
    } catch (err) {
      return res.serverError("Internal server error: " + err.toString());
    }
  };
  
const deleteLoan = async (req, res) => {
    try {
      const result = await Loan.destroy({
        where: {
          id: req.params.id,
        },
      });
      return res.jsonSuccess("Success delete Loan");
    } catch (err) {
      return res.serverError("Internal server error: " + err.toString());
    }
  };
  
const updateLoan = async (req, res) => {
    try {
      const result = await Loan.update(
        {
            employeeId: req.body.employeeId,
            loan_setting_id: req.body.loan_setting_id,
            amount: req.body.amount,
            interest: req.body.interest,
            note: req.body.note,
            max_installment: req.body.max_installment,
            status: req.body.status,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
  
      return res.jsonSuccess("Success update Loan");
    } catch (err) {
      return res.serverError("Internal server error: " + err.toString());
    }
};

module.exports = {
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
}