const mongoose = require('mongoose');
const Prescription = require("./../models/prescription");
const ErrorResponse = require("../utils/ErrorResponse");
require('../models/clinic');
const {request} = require("express");

const PrescriptionSchema = mongoose.model("prescriptions");
const DoctorSchema = mongoose.model("doctors");
const PatientSchema = mongoose.model("patients");
const ClinicShema = mongoose.model("clinic");


exports.getAllPrescriptions = (request, response, next) => {
    let sortBy;
    let fields;
    let reqQuery = {...request.query};
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
        sortBy = "_id";
    }
    let page = parseInt(request.query.page) || 1;
    let limit = parseInt(request.query.limit) || 100;
    let skip = (page - 1) * limit;

    PrescriptionSchema.find(JSON.parse(queryStr))
        .select(fields)
        .sort(sortBy)
        .limit(limit)
        .skip(skip)
        .then((result) => {
            response.status(200).json({success: true, data: result});
        })
        .catch((err) => next(new ErrorResponse(err.message, 500)));
}

exports.getAllPrescriptionsForDoctor = async (request, response, next) => {
    try {
        let doctor = await DoctorSchema.findOne({_id: request.params.id})
        if (!doctor) return next(new ErrorResponse("doctor not found", 422))

        let prescription = await PrescriptionSchema.find({doctorId: request.params.id})

        response.status(200).json({success: true, data: prescription})
    } catch (error) {
        return next(new ErrorResponse(error.message));
    }
}
exports.getAllPrescriptionsForPatient = async (request, response, next) => {
    try {
        let patient = await PatientSchema.findOne({_id: request.params.id})
        if (!patient) return next(new ErrorResponse("patient not found", 422))

        let prescription = await PrescriptionSchema.find({patientId: request.params.id})
        response.status(201).json({success: true, data: prescription})

    } catch (error) {
        return next(new ErrorResponse(error.message));
    }
}

exports.addPrescription = async (request, response, next) => {
    let doctor = await DoctorSchema.findOne({_id: request.body.doctorId})
    if (!doctor) return next(new ErrorResponse("Doctor not found", 422));

    let patient = await PatientSchema.findOne({_id: request.body.patientId})
    if (!patient) return next(new ErrorResponse("patient not found", 422));

    let clinic = await ClinicShema.findOne({_id: request.body.clinicId})
    if (!clinic) return next(new ErrorResponse("clinic not found", 422));

    let newPrescription = new Prescription({
        doctorId: request.body.doctorId,
        patientId: request.body.patientId,
        clinicId: request.body.clinicId,
        drugs: request.body.drugs,
    });

    newPrescription.save()
        .then(data => {
            response.status(201).json({success: true, data: data});
        }).catch(err => {
        return next(new ErrorResponse(err.message));
    });
}

exports.updatePrescription = async (request, response, next) => {

    try {
        if (request.role === 'doctor') {
            let doctor = await DoctorSchema.findOne({_id: request.id})
            if (!doctor) return next(new ErrorResponse("Doctor not found", 422));

            let prescription = await PrescriptionSchema.findById(request.body.id);
            if (!prescription) return next(new ErrorResponse("prescription not found", 422));

            if (prescription.doctorId !== request.id) {
                return next(new ErrorResponse("Not Authorized", 403));
            }
        }

        if (request.body.doctorId) {
            let doctor = await DoctorSchema.findOne({_id: request.body.doctorId})
            if (!doctor) return next(new ErrorResponse("patient not found", 422));
        }

        if (request.body.patientId) {
            let patient = await PatientSchema.findOne({_id: request.body.patientId})
            if (!patient) return next(new ErrorResponse("patient not found", 422));
        }

        if (request.body.clinicId) {
            let clinic = await ClinicShema.findOne({_id: request.body.clinicId})
            if (!clinic) return next(new ErrorResponse("clinic not found", 422));
        }

        PrescriptionSchema.updateOne({_id: request.body.id}, {
            $set: {
                drugs: request.body.drugs,
                doctorId: request.body.doctorId,
                patientId: request.body.patientId,
                clinicId: request.body.clinicId
            }
        }).then(data => {
            response.status(201).json({success: true});

        }).catch((err) => next(new ErrorResponse(err.message)));
    } catch (e) {
        return next(new ErrorResponse(e.message));
    }

}

exports.addDrugToPrescription = async (request, response, next) => {

    let prescription = await PrescriptionSchema.findOne({_id: request.params.id});

    if (!prescription)
        return next(new ErrorResponse("prescription not found", 404));

    await PrescriptionSchema.updateOne({_id: request.params.id}, {
        $addToSet: {drugs: request.body.drugs}
    }).then(data => {
        response.status(201).json({success: true});
    })
        .catch((err) => next(new ErrorResponse(err.message)));
}

exports.removeDrugFromPrescription = async (request, response, next) => {

    let prescription = await PrescriptionSchema.findOne({_id: request.params.id});

    if (!prescription)
        return next(new ErrorResponse("prescription not found", 404));

    await PrescriptionSchema.updateOne({_id: request.params.id}, {
        $pullAll: {drugs: request.body.drugs}
    }).then(data => {
        response.status(201).json({success: true});
    })
        .catch((err) => next(new ErrorResponse(err.message)));
}
     

