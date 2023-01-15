const path = require("path");
const fs = require("fs");
const Schedule = require("../models/Schedule.js");
const Attendance = require("../models/Attendance.js");
const Employee = require("../models/Employee.js");
const { JobTitle } = require("../models/JobModels.js");
const { Op } = require("sequelize");

module.exports.getSchedule = async (req, res) => {
  try {
    let schedule;
    if (req.query.keyword) {
      schedule = await Schedule.findAll({
        include: [
          {
            model: Employee,
            attributes: ["id", "firstName", "lastName"],
            where: {
              [Op.or]: [
                {
                  firstName: {
                    [Op.like]: `%${req.query.keyword}%`,
                  },
                },
                {
                  lastName: {
                    [Op.like]: `%${req.query.keyword}%`,
                  },
                },
              ],
            },
            include: {
              model: JobTitle,
              attributes: ["id", "name"],
            },
          },
        ],
      });
    } else if (req.query.date) {
      schedule = await Schedule.findAll({
        where: {
          date: Date.parse(req.query.date),
        },
        include: [
          {
            model: Employee,
            attributes: ["id", "firstName", "lastName"],
            include: {
              model: JobTitle,
              attributes: ["id", "name"],
            },
          },
        ],
      });
    } else {
      if(req.userData.role_id == 2 || req.userData.role_id == 3 || req.userData.role_id == 4) { //admin / subadmin / subsdiary
          schedule = await Schedule.findAll({
            order: [["id", "DESC"]],
            where: {
              [Op.or]: [
                {
                  unique_id: req.userData.unique_id,
                },
              ],
            },
            include: [
              {
                model: Employee,
                attributes: ["id", "firstName", "lastName"],
                include: {
                  model: JobTitle,
                  attributes: ["id", "name"],
                },
              },
            ],
          });
      }else {
          schedule = await Schedule.findAll({
            order: [["id", "DESC"]],
            where: {
              employeeId: req.userData.employee.id,  
            },
            include: [
              {
                model: Employee,
                attributes: ["id", "firstName", "lastName"],
                include: {
                  model: JobTitle,
                  attributes: ["id", "name"],
                },
              },
            ],
          });
      }
    }

    res.status(200).json({
      status: 200,
      result: schedule,
    });
  } catch (e) {
    res.send({
      message: "error",
      error: e.toString(),
    });
  }
};

module.exports.addSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.create({
      employeeId: req.body.employeeId,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      schedule: req.body.schedule,
      unique_id: req.userData.unique_id,
    });

    res.send({
      message: "success",
    });
  } catch (e) {
    res.send({
      message: "error",
      error: e,
    });
  }
};

// My Attendance

module.exports.getAttendance = async (req, res) => {
  try {
    let result;

    if (req.query.keyword) {
      result = await Attendance.findAll({});
    } else if (req.query.date) {
      result = await Attendance.findAll({
        where: {
          date: req.query.date,
        },
      });
    } else {
      result = await Attendance.findAll({
          order: [["id", "DESC"]]
      });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Internal server eror",
      error: err,
    });
  }
};

module.exports.addAttendance = async (req, res) => {
  try {
    let result;
    const find = await Attendance.findOne({
      order: [["date", "DESC"]],
      raw: true,
      nest: true,
    });

    if (find) {
      if (
        new Date(find.date).toDateString() == new Date().toDateString() &&
        find.isChecked == 0
      ) {
        // check out
        result = await Attendance.update(
          {
            checkOut: req.body.checkIn,
            noteCheckOut: req.body.noteCheckIn,
            isChecked: 1,
          },
          { where: { id: find.id } }
        );
        const find2 = await Attendance.findOne({
              where: {
                id: find.id,
              },
              raw: true,
              nest: true,
        });
        
        let checkIn = find2.checkIn;
        let checkOut = find2.checkOut; 
        
        let duration = parseInt(checkOut.split(":")[0]) - parseInt(checkIn.split(":")[0]);
        let duration2 = parseInt(checkOut.split(":")[1]) + parseInt(checkIn.split(":")[1]);
        
        if (duration2 >= 60) {
          duration += 1
          duration2 %= duration2;
        }
        
        await Attendance.update(
          {
            duration: `${duration}:${duration2}`
          },
          { where: { id: find2.id } }
        );
      } else {
        // send warning
        // return res.status(400).json({
        //     status: 400,
        //     message: "You already checked in!"
        // });
        // check in
          result = await Attendance.create({
            employeeId: req.body.employeeId,
            checkIn: req.body.checkIn,
            noteCheckIn: req.body.noteCheckIn,
            isChecked: 0,
          });
      }
    } else {
      // check in
      result = await Attendance.create({
        employeeId: req.body.employeeId,
        checkIn: req.body.checkIn,
        noteCheckIn: req.body.noteCheckIn,
        isChecked: 0,
      });
    }

    res.json({
      message: "Success Check In / Out",
      data: find,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Internal server eror",
      error: err,
    });
  }
};
