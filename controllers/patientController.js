const mongoose = require('mongoose');
require("./../models/patient");
const {checkEmailUnique} = require("../middlewares/dataValidator");
const ErrorResponse = require("../utils/ErrorResponse");

const patientSchema = mongoose.model("patients");

exports.getAllPatients = (request, response, next) => {

    patientSchema.find()
        .then((data) => {
            response.status(200).json(data);
        })
        .catch(error => next(error));
}

exports.addPatient = async (request, response, next) => {

    try {
        await checkEmailUnique(request.body.email);

        let newPatients = new patientSchema({
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

exports.updateAllPatients = (request, response, next) => {
    patientSchema.updateOne({_id: request.body.id}, {
        $set: {
            _id: request.body.id,
            fullname: request.body.name,
            age: request.body.age,
            password: request.body.password,
            email: request.body.email,
            invoice: request.body.invoice,
            doctor: request.body.doctor,

        }
    })

        .then((data) => {

            // if we tryed to update an id not in the DB
            //upsert = update + insert
            if (data.modifiedCount == 0) {
                // sending it as an error cuz  we cant tell info about our data 
                let error = new Error("patient Not Found ");
                next(error);
            } else {
                response.status(201).json({message: "From Update In Controller"})
            }
        })

        .catch(error => next(error))

}

exports.deletePatient = (request, response, next) => {
    patientSchema.deleteOne({_id: request.body.id}, {}).then((data) => {

        // check if the exist or not
        if (data.deletedCount == 0) {
            let error = new Error("Patients Not Found ");
            next(error);
        } else {
            response.status(201).json({message: "From Delete In Controller"})

        }
    })

        .catch(error => next(error))
}

exports.getPatientByID = (request, response, next) => {
    response.status(201).json({data: request.params.id})
}