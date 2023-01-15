const MyTodo = require("../models/MyTodo.js");
const Event = require("../models/Event.js");

module.exports.getMyTodo = async (req, res) => {
    try {
        const result = await MyTodo.findAll({
            where: {
                employeeId: req.userData.employee.id
            }
        });
        res.status(200).json({
            status: 200,
            result: result,
        })
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: err,
        })
    }
}

module.exports.addMyTodo = async (req, res) => {
    try {
        const result = await MyTodo.create({
            title: req.body.title,
            date: req.body.date,
            time: req.body.time,
            calendar: req.body.calendar,
            details: req.body.details,
            employeeId: req.userData.employee.id,
        })
        res.status(201).json(result ? {
            status: 201,
            message: "Success Create"
        } : {
            message: "Error Create"
        })
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: err,
        })
    }
}

module.exports.deleteMyTodo = async (req, res) => {
    try {
        const result = await MyTodo.destroy({
            where: {
                id: req.query.id
            }
        })
        res.status(200).json(result ? {
            status: 200,
            message: "Success deleting"
        } : {
            message: "Error Deleting"
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: err,
        })
    }
}

module.exports.updateMyTodo = async (req, res) => {
    try {
        const result = await MyTodo.update({
            title: req.body.title,
            date: req.body.date,
            time: req.body.time,
            calendar: req.body.calendar,
            details: req.body.details,
        }, {
            where: {
                id: req.body.id
            }
        });

        res.status(200).json(result ? {
            status: 200,
            message: "Success Updating"
        } : {
            message: "Error Updating"
        })
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: err,
        })
    }
}