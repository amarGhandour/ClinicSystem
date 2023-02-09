const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/ErrorResponse");
const {request, response} = require("express");
const mongoose = require("mongoose");

require("./../models/doctor");
require("./../models/patient");
require("./../models/employee");

const DoctorSchema = mongoose.model("doctors");
const PatientSchema = mongoose.model("patients");
const EmployeeSchema = mongoose.model("employee");

module.exports = async (request, response, next) => {

    try {
        let token = request.get("Authorization").split(" ")[1];
        let decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        request.id = decodedToken.id;
        request.role = decodedToken.role;

        console.log(request.role)
        if (request.role === 'employee' || request.role === 'admin') {
            request.user = await EmployeeSchema.findById(decodedToken.id)
        } else if (request.role === 'doctor') {
            request.user = await DoctorSchema.findById(decodedToken.id)
        } else {
            request.user = await PatientSchema.findById(decodedToken.id)
        }

    } catch (err) {
        next(new ErrorResponse('Not Authorized', 401));
    }
    next();
}

module.exports.authorize = (...roles) => {
    return (request, response, next) => {
        if (!roles.includes(request.role)) {
            return next(new ErrorResponse('You are not authorized.', 403));
        }
        next();
    }
}
