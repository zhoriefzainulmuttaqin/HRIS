const Sequelize = require("sequelize");
const db = require("../config/database.js");
const Employee = require("./Employee.js");

const Schedule = db.define('schedules', {
    // Define attributes
    employeeId: Sequelize.STRING,
    startDate: Sequelize.DATE,
    endDate: Sequelize.DATE,
    schedule: Sequelize.STRING,
    unique_id: Sequelize.STRING,
    created_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    updated_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },

}, {
    // Freeze Table Name
    freezeTableName: true,
    timestamps: false
});

Schedule.belongsTo(Employee, {
    foreignKey: "employeeId"
})

// Export model Product
module.exports = Schedule;