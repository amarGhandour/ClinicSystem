const mongoose = require("mongoose");
require("./../models/employee");
require("./../models/clinic");
const ErrorResponse = require("../utils/ErrorResponse");
const {checkEmailUnique} = require("../middlewares/dataValidator");
const EmployeeSchema = mongoose.model("employee");
const ClinicShema = mongoose.model("clinic");

exports.getAllEmployees = (request, response, next) => {
    EmployeeSchema.find()
        .populate([{path: "clinic", select: "name"}])
        .then((result) => {
            response.status(200).json({
                success: true,
                data: result,
            });
        })
        .catch((err) => {
            next(new ErrorResponse(err.message, 500));
        });
};

exports.addEmployee = async (request, response, next) => {

    try {
        await checkEmailUnique(request.body.email);

        let clinic = await ClinicShema.findOne({_id: request.body.clinic});

        if (!clinic)
            return next(
                new ErrorResponse("you cant assign employee to clinic doesn't exist")
            );

        let newEmployee = new EmployeeSchema({
            name: request.body.name,
            //   mobileNumber: request.body.mobileNumber,
            clinic: request.body.clinic,
            salary: request.body.salary,
            email: request.body.email,
            password: request.body.password,
        });
        newEmployee
            .save()
            .then((result) => {
                response.status(201).json(result);
            })
            .catch((err) => next(new ErrorResponse(err.message)));

    } catch (err) {
        next(err);
    }

};

exports.updateEmployee = async (request, response, next) => {

    try {
        if (request.body.email)
            await checkEmailUnique(request.body.email);

        if (request.body.clinic) {
            let clinic = await ClinicShema.findOne({_id: request.body.clinic});
            if (!clinic)
                return next(new ErrorResponse("clinic doesn't exist"));
        }
        EmployeeSchema.updateOne(
            {_id: request.body.id},
            {
                $set: {
                    name: request.body.name,
                    //   mobileNumber: request.body.mobileNumber,
                    clinic: request.body.clinic,
                    salary: request.body.salary,
                    email: request.body.email,
                    password: request.body.password,
                },
            }
        ).then((result) => {
            return response.status(201).json({
                success: result.acknowledged,
            });
        }).catch(err => next(new ErrorResponse("Employee not be updated.")));

    } catch (err) {
        next(err);
    }
};

exports.deleteEmployee = (request, response, next) => {
    EmployeeSchema.deleteOne({_id: request.params.id})
        .then((result) => {
            response.status(201).json({message: "Employee has been deleted"});
        })
        .catch((err) => next(new ErrorResponse(err.message)));
};

exports.getEmployeeByID = (request, response, next) => {
    EmployeeSchema.findOne({_id: request.params.id})
        .then((data) => {
            if (data != null) response.status(200).json(data);
            else {
                next(new ErrorResponse("Employee does not exist", 403));
            }
        })
        .catch((error) => next(error));
};
