const Sequelize = require("sequelize");
const db = require("../config/database.js");
const { JobPosition } = require("./JobModels");
const Employee = require("./Employee");

const Respondent = db.define(
  "respondents",
  {
    // Define attributes
    document_id: Sequelize.INTEGER,
    employeeId: Sequelize.INTEGER,
    jobposition_id: Sequelize.INTEGER,
    date: Sequelize.DATE,
    time: Sequelize.TIME,
    type: Sequelize.STRING,
    status: {
      type: Sequelize.STRING,
      defaultValue: "pending",
    },
    unique_id: Sequelize.STRING,
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    timestamps: false,
  }
);

Respondent.belongsTo(Employee, {
  as: "employee",
  sourceKey: "id",
  foreignKey: "employeeId",
});

Respondent.belongsTo(JobPosition, {
  as: "jobposition",
  sourceKey: "id",
  foreignKey: "jobposition_id",
});

module.exports = Respondent;
