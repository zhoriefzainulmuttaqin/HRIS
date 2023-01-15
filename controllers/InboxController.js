const Inbox = require("../models/Inbox.js");
const Employee = require("../models/Employee.js");
const Applicant = require("../models/Applicant.js");
const { Op } = require("sequelize");

module.exports.getInbox = async (req, res) => {
    try {
        const includes = [
            {
                model: Employee,
                as: "employee",
                attributes: ["id", "firstName", "image"]
            }
        ]
        const data = await Inbox.findAll({
            where: {
                [Op.or]: [
                    {
                        toEmployee: req.userData.employee.id,
                    },
                    {
                        unique_id: req.userData.role_id == 2 || req.userData.role_id == 3 || req.userData == 4 ? {
                            [Op.like]: `${req.userData.unique_id}%`
                        } : req.userData.unique_id
                    }
                ]
            },
            include: includes,
            raw: true,
            nest: true
        })

        return res.jsonData(data)
    } catch (error) {
        return res.serverError("Internal server error: " + error.toString())
    }
}

module.exports.getSingleInbox = async (req, res) => {
    try {
        const includes = [
            {
                model: Employee,
                as: "employee",
                attributes: ["id", "firstName", "image"]
            }
        ]

        const data = await Inbox.findOne({
            where: {
                id: req.params.id
            },
            include: includes,
            raw: true,
            nest: true
        })

        return res.jsonData(data)
    } catch (error) {
        return res.serverError("Internal server error: " + error.toString())
    }
}

// module.exports.pushInbox = async (req, res) => {
//     try {
//         await Inbox.create({
//             toEmployee: req.body.to_employee,
//             employeeId: req.userData.employee.id,
//             title: req.body.title,
//             message: req.body.message,
//             applicant_id: req.body.applicant_id,
//             link: req.body.link,
//             type: req.body.type,
//             otherId: req.body.otherId,
//         })

//         return res.jsonSuccess("Success read status")
//     } catch (error) {
//         return res.serverError("Internal server error: " + error.toString())
//     }
// }

module.exports.pushInbox = async (data) => {
    try {
        return await Inbox.create({
            toEmployee: data.to_employee,
            employeeId: data.employeeId,
            title: data.title,
            message: data.message,
            applicant_id: data.applicant_id,
            link: data.link,
            type: data.type,
            otherId: data.otherId,
            unique_id: data.unique_id
        })
    } catch (error) {
        return res.serverError("Internal server error: " + error.toString())
    }
}

module.exports.readStatus = async (req, res) => {
    try {
        await Inbox.update({
            isRead: true
        }, {where: {id: req.body.id}})

        return res.jsonSuccess("Success read status")
    } catch (error) {
        return res.serverError("Error " + errot.toString())
    }
}

module.exports.deleteInbox = async (req, res) => {
    try {
        await Inbox.delete({where: {id: req.query.id}})

        return res.jsonSuccess("Success delete inbox")
    } catch (error) {
        return res.serverError("Error " + errot.toString())
    }
}