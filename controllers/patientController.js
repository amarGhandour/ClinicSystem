const mongoose = require('mongoose');
require("./../models/patient");
const {checkEmailUnique} = require("../middlewares/dataValidator");
const ErrorResponse = require("../utils/ErrorResponse");

const PatientSchema = mongoose.model("patients");

exports.getAllPatients = (request, response, next) => {

    PatientSchema.find()
        .then((data) => {
            response.status(200).json(data);
        })
        .catch(error => next(error));
}

exports.addPatient = async (request, response, next) => {

    try {
        await checkEmailUnique(request.body.email);

        let newPatients = new PatientSchema({
            name: request.body.name,
            age: request.body.age,
            password: request.body.password,
            email: request.body.email,
        });
        newPatients.save()
            .then(result => {
                response.status(201).json({
                    success: true,
                    data: result
                });
            })
            .catch(error => next(new ErrorResponse(error.message)));
    } catch (err) {
        return next(err.message)
    }

}

exports.updatePatient = async (request, response, next) => {

    if (request.body.email) {
        await checkEmailUnique(request.body.email);
    }

    PatientSchema.updateOne({_id: request.body.id}, {
        $set: {
            _id: request.body.id,
            name: request.body.name,
            age: request.body.age,
            password: request.body.password,
            email: request.body.email
        }
    }).then((data) => {
        response.status(201).json({success: true});
    }).catch(error => next(new ErrorResponse(error.message)))

}

exports.deletePatient = (request, response, next) => {
    PatientSchema.deleteOne({_id: request.params.id}).then((data) => {
        response.status(201).json({success: true})
    })
        .catch(error => next(new ErrorResponse(error.message)))
}

exports.getPatientByID = async (request, response, next) => {

    let patient = await PatientSchema.findOne({_id: request.params.id});

    if (!patient)
        return next(new ErrorResponse("Not found", 404));

    response.status(200).json({success: true, data: patient})
}