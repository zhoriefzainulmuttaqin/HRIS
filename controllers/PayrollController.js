const PayrollComponent = require("../models/PayrollComponent.js");
const Employee = require("../models/Employee.js");
const EmployeeStatus = require("../models/Employeestatus.js");
const EmployeePayroll = require("../models/EmployeePayroll.js")
const PayrollBonus = require("../models/PayrollBonus.js");
const {
  JobTitle,
  JobGrade,
  JobLevel,
  JobPosition,
} = require("../models/JobModels.js");

// pagination function
const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? +(page - 1) * limit : 0;
  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: requests } = data;
  const currentPage = page ? +parseInt(page) : 1;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, requests, totalPages, currentPage };
};

// PAYROLL COMPONENT CTRL
module.exports.getAllPayrollComponent = async (req, res) => {
  try {
    const result = await PayrollComponent.findAll({
      where: {
        unique_id: req.userData.unique_id,
      },
      include: {
        model: Employee,
        include: [
          {
            model: EmployeeStatus,
          },
          {
            model: JobPosition
          }
        ]
      }
    });
    result.map(res => {
      if (res.incomes != null) {
        res.incomes = JSON.parse(res.incomes)
      }
      if (res.deductions != null) {
        res.deductions = JSON.parse(res.deductions)
      }
      if (res.benefits != null) {
        res.benefits = JSON.parse(res.benefits)
      }
    })
    return res.jsonData(result);
  } catch (err) {
    return res.serverError("Internal server error: " + err.toString());
  }
};

module.exports.addPayrollComponent = async (req, res) => {
  try {
    const result = await PayrollComponent.create({
      employeeId: req.body.employeeId,
      unique_id: req.userData.unique_id,
      basic_salary: req.body.basic_salary,
      incomes: req.body.incomes,
      deductions: req.body.deductions,
      benefits: req.body.benefits,
    });

    const findEmpPayroll = await EmployeePayroll.findOne({ where: { employeeId: req.body.employeeId } });

    if (findEmpPayroll) {
      await EmployeePayroll.update(
        {
          payroll_component_id: result.id
        },
        {
          where: {
            employeeId: req.body.employeeId
          }
        }
      )
    } else {
      await EmployeePayroll.create(
        {
          payroll_component_id: result.id
        },
      )
    }

    return res.jsonSuccessCreated("Success create PayrollComponent");
  } catch (err) {
    return res.serverError("Internal server error: " + err.toString());
  }
};

module.exports.deletePayrollComponent = async (req, res) => {
  try {
    const result = await PayrollComponent.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.jsonSuccess("Success delete PayrollComponent");
  } catch (err) {
    return res.serverError("Internal server error: " + err.toString());
  }
};

module.exports.updatePayrollComponent = async (req, res) => {
  try {
    const result = await PayrollComponent.update(
      {
        employeeId: req.body.employeeId,
        basic_salary: req.body.basic_salary,
        incomes: req.body.incomes,
        deductions: req.body.deductions,
        benefits: req.body.benefits,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    const findEmpPayroll = await EmployeePayroll.findOne({ where: { employeeId: req.body.employeeId } });
    if (findEmpPayroll) {
      await EmployeePayroll.update(
        {
          payroll_component_id: result.id
        },
        {
          where: {
            employeeId: req.body.employeeId
          }
        }
      )
    } else {
      await EmployeePayroll.create(
        {
          payroll_component_id: result.id
        },
      )
    }

    return res.jsonSuccess("Success update PayrollComponent");
  } catch (err) {
    return res.serverError("Internal server error: " + err.toString());
  }
};

// PAYROLL BONUS CTRL
module.exports.addBonus = async (req, res) => {
  try {
    let delegated_to;
    if (req.body.delegated_to != null) {
      delegated_to = req.body.delegated_to;
    } else {
      delegated_to = null;
    }
    await PayrollBonus.create({
      name: req.body.name,
      amount: req.body.amount,
      status: req.body.status,
      unique_id: req.userData.unique_id,
      delegated_to: delegated_to,
    });

    return res.status(200).send({
      message: "Success",
    });
  } catch (error) {
    res.status(400).send({
      message: `Error => ${error}`
    });
  }
}

module.exports.updateBonus = async (req, res) => {
  let delegated_to;
  try {
    if (req.body.delegated_to != null) {
      delegated_to = req.body.delegated_to;
    } else {
      delegated_to = null;
    }
    await PayrollBonus.update({
      name: req.body.name,
      amount: req.body.amount,
      status: req.body.status,
      delegated_to: delegated_to,
    }, {
      where: {
        id: req.body.id,
      },
    });

    return res.status(200).send({
      message: "Success",
    });
  } catch (error) {
    res.status(400).send({
      message: `Error => ${error}`
    });
  }
}

module.exports.getDetailBonus = async (req, res) => {
  try {
    var bonus = await PayrollBonus.findOne({
      where: {
        id: req.query.id,
      },
      raw: true,
      nest: true,
    });

    if (bonus) {
      if (bonus.status == "employees") {
        let ids = JSON.parse(bonus.delegated_to);
        bonus.delegated_to = await Employee.findAll({
          attributes: ['id', 'firstName'],
          where: {
            id: ids,
          }
        });
      } else if (bonus.status == "specific") {
        let fromJson = JSON.parse(bonus.delegated_to);
        for (var i = 0; i < fromJson.length; i++) {
          var rows = fromJson[i];
          var ids = rows.data;
          if (rows.name == "Job Grade") {
            rows.data = await JobGrade.findAll({
              attributes: ['id', 'name'],
              where: {
                id: ids,
              }
            });
          } else if (rows.name == "Job Level") {
            rows.data = await JobLevel.findAll({
              attributes: ['id', 'name'],
              where: {
                id: ids,
              }
            });
          } else if (rows.name == "Job Title") {
            rows.data = await JobTitle.findAll({
              attributes: ['id', 'name'],
              where: {
                id: ids,
              }
            });
          } else if (rows.name == "Job Position") {
            rows.data = await JobPosition.findAll({
              attributes: ['id', 'name'],
              where: {
                id: ids,
              }
            });
          }
        }
        bonus.delegated_to = fromJson;
      }
    }

    res.status(200).send({
      message: "Success",
      data: bonus,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: `Error => ${error}`
    });
  }
}

module.exports.deleteBonus = async (req, res) => {
  try {
    await PayrollBonus.destroy({
      where: {
        id: req.query.id
      },
    });

    return res.status(200).send({
      message: "Success"
    });
  } catch (error) {
    res.status(400).send({
      message: `Error => ${error}`
    });
  }
}

module.exports.getBonus = async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  try {
    var data = await PayrollBonus.findAndCountAll({
      raw: true,
      nest: true,
      where: {
        unique_id: req.userData.unique_id,
        unique_id: null,
      }
    });
    for (var i = 0; i < data.rows.length; i++) {
      let rows = data?.rows[i];
      var delegated_to;
      if (rows.status != "all") {
        let fromJson = JSON.parse(rows?.delegated_to);
        console.log(fromJson);
        if (rows.status == "employees") {
          delegated_to = `${fromJson.length} Employees`;
        } else {
          delegated_to = `${fromJson.length} Position`;
        }
      } else {
        delegated_to = "All Position";
      }
      rows.delegated_to = delegated_to;
    }
    let response = getPagingData(data, page, limit);
    res.status(200).send({
      message: 'Success',
      data: response,
    });
  } catch (error) {
    res.status(400).send({
      message: `Error => ${error}`
    });
  }
}