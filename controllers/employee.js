const mongoose = require("mongoose");
require("./../models/employee");
require("./../models/clinic");
const ErrorResponse = require("../utils/ErrorResponse");
const EmployeeSchema = mongoose.model("employee");
const ClinicShema = mongoose.model("clinic");

exports.getAllEmployees = (request, response, next) => {
  EmployeeSchema.find()
    .populate([{ path: "clinic", select: "name" }])
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

exports.addEmployee = (request, response, next) => {
  ClinicShema.findOne({ _id: request.body.clinic }).then((data) => {
    if (data != null) {
      let newEmployee = new EmployeeSchema({
        _id: request.body.id,
        empName: request.body.name,
        mobileNumber: request.body.mobileNumber,
        clinic: request.body.clinic,
        salary: request.body.salary,
        username: request.body.username,
        password: request.body.password,
      });
      newEmployee
        .save()
        .then((result) => {
          response.status(201).json(result);
        })
        .catch((err) => next(new ErrorResponse(err.message)));
    } else {
      next(
        new ErrorResponse("you cant assign employee to clinic doesn't exist")
      );
    }
  });
};

exports.updateEmployee = (request, response, next) => {
  ClinicShema.findOne({ _id: request.body.clinic }).then((data) => {
    if (data != null) {
      EmployeeSchema.updateOne(
        { _id: request.body.id },
        {
          $set: {
            empName: request.body.name,
            mobileNumber: request.body.mobileNumber,
            clinic: request.body.clinic,
            salary: request.body.salary,
            username: request.body.username,
            password: request.body.password,
          },
        }
      );
    } else {
      next(new ErrorResponse("clinic doesn't exist"));
    }
  });
};

exports.deleteEmployee = (request, response, next) => {
  EmployeeSchema.deleteOne({ _id: request.params.id })
    .then((result) => {
      response.status(201).json({ message: "Drug has been deleted" });
    })
    .catch((err) => next(new ErrorResponse(err.message)));
};

exports.getEmployeeByID = (request, response, next) => {
  EmployeeSchema.findOne({ _id: request.params.id })
    .then((data) => {
      if (data != null) response.status(200).json(data);
      else {
        next(new ErrorResponse("Employee does not exist", 403));
      }
    })
    .catch((error) => next(error));
};
