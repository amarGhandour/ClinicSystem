const mongoose = require('mongoose');
require('../models/patient');
require('../models/doctor');
require('../models/employee');

const ErrorResponse = require("../utils/ErrorResponse");
const {checkEmailUnique} = require("../middlewares/dataValidator");
const jwt = require("jsonwebtoken");

const PatientSchema = mongoose.model("patients");
const EmployeesSchema = mongoose.model("employee");
const DoctorsSchema = mongoose.model("doctors");

exports.register = async (request, response, next) => {

    try {
        await checkEmailUnique(request.body.email);
        const Patient = new PatientSchema({
            name: request.body.name,
            age: request.body.age,
            password: request.body.password,
            email: request.body.email
        });

        const patient = await Patient.save();
        response.status(201).json({
            success: true,
            token: patient.getSignedJwtToken()
        });
    } catch (err) {
        next(new ErrorResponse(err.message));
    }

}

exports.login = async (request, response, next) => {

    try {
            let user = null;
            user = await PatientSchema.findOne({email: request.body.email}).select('+password');

            if (!user) {
                user = await DoctorsSchema.findOne({email: request.body.email}).select('+password');

                if (!user) {
                    user = await EmployeesSchema.findOne({email: request.body.email}).select('+password');
                }
            }
            if (!user) {
                return next(new ErrorResponse("invalid credentials", 401));
            }

            let isMatch = await user.matchPassword(request.body.password);

            if (!isMatch) {
                return next(new ErrorResponse('invalid credentials', 401));
            }

            const token = user.getSignedJwtToken();

        response.status(200).json({
            success: true,
            token: token
        });

    } catch (err) {
        next(new ErrorResponse(err.message));
    }
}


exports.getMe = async (request, response, next) => {
    const user = request.user;

    response.status(200).json({
        success: true,
        data: user,
    });
}

exports.logout = async (request, response, next) => {

    // todo remove token from client side
    let token = jwt.sign({id: this._id, role: "user"}, "INVALIDLOGOUT", {
        expiresIn: process.env.JWT_EXPIRE,
    });

    response.status(200).json({
        success: true,
        token: token
    });
}