const mongoose = require('mongoose');
require('../models/patient');

const ErrorResponse = require("../utils/ErrorResponse");
const {checkEmailUnique} = require("../middlewares/dataValidator");

const patientSchema = mongoose.model("patients");

exports.register = async (request, response, next) => {

    try {
        await checkEmailUnique(request.body.email);
        const Patient = new patientSchema({
            name: request.body.name,
            age: request.body.age,
            password: request.body.password,
            email: request.body.email,
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
        if (request.body.email === process.env.ADMIN_EMAIL && request.body.password === process.env.ADMIN_PASS) {
            // todo
            // get admin from employees
            // create a token for him with a response
        } else {
            const patient = await patientSchema.findOne({email: request.body.email}).select('+password');
            if (!patient) {
                return next(new ErrorResponse('invalid credentials', 401));
            }
            let isMatch = await patient.matchPassword(request.body.password);

            if (!isMatch) {
                return next(new ErrorResponse('invalid credentials', 401));
            }
            const token = patient.getSignedJwtToken();

            response.status(200).json({
                success: true,
                token: token
            });
        }

    } catch (err) {
        next(new ErrorResponse(err.message));
    }
}
