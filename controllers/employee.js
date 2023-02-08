const mongoose = require("mongoose");
require("./../models/employee");
require("./../models/clinic");
const ErrorResponse = require("../utils/ErrorResponse");
const { checkEmailUnique } = require("../middlewares/dataValidator");
const EmployeeSchema = mongoose.model("employee");
const ClinicShema = mongoose.model("clinic");

exports.getAllEmployees = (request, response, next) => {
  let sortBy;
  let fields;
  let reqQuery = { ...request.query };
  const removedFields = ["select", "sort", "page", "limit"];
  removedFields.forEach((el) => delete reqQuery[el]);
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  if (request.query.select) {
    fields = request.query.select.split(",").join(" ");
  }
  if (request.query.sort) {
    sortBy = request.query.sort.split(",").join(" ");
  } else {
    sortBy = "name";
  }
  let page = parseInt(request.query.page) || 1;
  let limit = parseInt(request.query.limit) || 100;
  let skip = (page - 1) * limit;
  EmployeeSchema.find(JSON.parse(queryStr))
    .select(fields)
    .sort(sortBy)
    .limit(limit)
    .skip(skip)
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

exports.addEmployee = async (request, response, next) => {
  try {
    await checkEmailUnique(request.body.email);

    let clinic = await ClinicShema.findOne({ _id: request.body.clinic });

    if (!clinic)
      return next(
        new ErrorResponse("you cant assign employee to clinic doesn't exist")
      );

    let newEmployee = new EmployeeSchema({
      name: request.body.name,
      mobileNumber: request.body.mobileNumber,
      clinic: request.body.clinic,
      salary: request.body.salary,
      email: request.body.email,
      password: request.body.password,
      age: request.body.age,
      activate: request.body.activate,
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
    if (request.body.email) await checkEmailUnique(request.body.email);

    if (request.body.clinic) {
      let clinic = await ClinicShema.findOne({ _id: request.body.clinic });
      if (!clinic) return next(new ErrorResponse("clinic doesn't exist"));
    }
    EmployeeSchema.updateOne(
      { _id: request.body.id },
      {
        $set: {
          name: request.body.name,
          mobileNumber: request.body.mobileNumber,
          clinic: request.body.clinic,
          salary: request.body.salary,
          email: request.body.email,
          password: request.body.password,
          age: request.body.age,
        },
      }
    )
      .then((result) => {
        return response.status(201).json({
          success: result.acknowledged,
        });
      })
      .catch((err) => next(new ErrorResponse(err.message)));
  } catch (err) {
    next(err);
  }
};

exports.deleteEmployee = (request, response, next) => {
  EmployeeSchema.deleteOne({ _id: request.params.id })
    .then((result) => {
      response.status(201).json({ message: "Employee has been deleted" });
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

exports.activateEmployee = async (request, response, next) => {
  const employee = await EmployeeSchema.findById(request.params.id);
  if (!employee) return next(new ErrorResponse("Employee does not exist"));
  EmployeeSchema.updateOne(
    { _id: request.params.id },
    {
      $set: {
        activate: true,
      },
    }
  )
    .then((result) => {
      return response.status(201).json({
        success: result.acknowledged,
      });
    })
    .catch((error) => {
      next(new ErrorResponse(error.message));
    });
};
exports.deactivateEmployee = async (request, response, next) => {
  const employee = await EmployeeSchema.findById(request.params.id);
  if (!employee) return next(new ErrorResponse("Employee does not exist"));
  EmployeeSchema.updateOne(
    { _id: request.params.id },
    {
      $set: {
        activate: false,
      },
    }
  )
    .then((result) => {
      return response.status(201).json({
        success: result.acknowledged,
      });
    })
    .catch((error) => {
      next(new ErrorResponse(error.message));
    });
};
