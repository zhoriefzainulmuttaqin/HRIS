const Sequelize = require("sequelize");
const db = require("../config/database.js");
const LeaveType = require("./LeaveType.js");
const Employee = require("./Employee.js");
const { JobPosition } = require("./JobModels.js");

const Leave = db.define(
  "leaves",
  {
    // Define attributes
    employeeId: Sequelize.INTEGER,
    jobposition_id: Sequelize.INTEGER,
    leave_type_id: Sequelize.INTEGER,
    start_date: Sequelize.DATE,
    end_date: Sequelize.DATE,
    note: Sequelize.STRING,
    date: Sequelize.DATE,
    unique_id: Sequelize.STRING,
    status: {
      type: Sequelize.STRING,
      defaultValue: "pending",
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    timestamps: false,
  }
);

Leave.belongsTo(LeaveType, {
  as: "leave_type",
  sourceKey: "id",
  foreignKey: "leave_type_id",
});

Leave.belongsTo(Employee, {
  as: "employee",
  sourceKey: "id",
  foreignKey: "employeeId",
});

Leave.belongsTo(JobPosition, {
  as: "jobposition",
  sourceKey: "id",
  foreignKey: "jobposition_id",
});

module.exports = Leave;
