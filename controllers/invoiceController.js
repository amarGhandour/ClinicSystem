const mongoose = require("mongoose");
require("./../models/invoice");
require("./../models/doctor");
require("./../models/patient");
const ErrorResponse = require("../utils/ErrorResponse");
const InvoiceSchema = mongoose.model("invoices");
const DoctorSchema = mongoose.model("doctors");
const PatientSchema = mongoose.model("patients");
const EmployeeSchema = mongoose.model("employee");

exports.getAllInvoices = (request, response, next) => {
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
        sortBy = "doctorId";
    }
    let page = parseInt(request.query.page) || 1;
    let limit = parseInt(request.query.limit) || 100;
    let skip = (page - 1) * limit;

    InvoiceSchema.find(JSON.parse(queryStr))
        .select(fields)
        .sort(sortBy)
        .limit(limit)
        .skip(skip)
        .populate([
            {path: "patients", select: "name"},
            {path: "doctor", select: "name"},
        ])
        .then((result) => {
            response.status(200).json({message: "success", result});
        })
        .catch((error) => {
            next(new ErrorResponse(error.message));
        });
};
exports.addInvoice = async (request, response, next) => {
    let doctor = await DoctorSchema.findById(request.body.doctorId);
    let patient = await PatientSchema.findById(request.body.patientId);

    if (request.role === 'employee') {
        let employee = await EmployeeSchema.findById(request.id);

        if (!doctor.clinics.includes(employee.clinic)) {
            return next(new ErrorResponse("Not Authorized", 403));
        }
    }


    if (doctor == null || patient == null) {
        return next(new ErrorResponse("Doctor or Patient not found", 404));
    }
    let newInvoice = new InvoiceSchema({
        ...request.body,
    });
    newInvoice
        .save()
        .then((result) => {
            response.status(200).json({message: "success", result});
        })
        .catch((error) => {
            next(new ErrorResponse(error.message));
        });
};
exports.updateInvoice = async (request, response, next) => {
    let doctor = await DoctorSchema.findById(request.body.doctorId);
    let patient = await PatientSchema.findById(request.body.patientId);

    if (doctor == null || patient == null) {
        return next(new ErrorResponse("Doctor or Patient not found", 404));
    }

    if (request.role === 'employee') {
        let employee = await EmployeeSchema.findById(request.id);

        if (!doctor.clinics.includes(employee.clinic)) {
            return next(new ErrorResponse("Not Authorized", 403));
        }
    }

    InvoiceSchema.updateOne(
        {_id: request.body._id},
        {
            $set: {
                patientId: request.body.patientId,
                doctorId: request.body.doctorId,
                status: request.body.status,
                total: request.body.total,
                paymentMethod: request.body.paymentMethod,
            },
        }
    )
        .then((result) => {
            response.status(200).json({message: "Invoice has been updated"});
        })
        .catch((err) => next(new ErrorResponse(err.message)));
};

exports.deleteInvoice = (request, response, next) => {
    InvoiceSchema.delete({_id: request.params.id})
        .then(() => {
            response.status(201).json({message: "Invoice has been deleted"});
        })
        .catch((err) => next(new ErrorResponse(err.message)));
};

exports.getInvoiceByID = (request, response, next) => {
    InvoiceSchema.findOne({_id: request.params.id})
        .then((data) => {
            if (data != null) response.status(200).json(data);
            else {
                next(new ErrorResponse("Invoice does not exist", 403));
            }
        })
        .catch((error) => next(new ErrorResponse(error.message)));
};

exports.getDoctorInvoices = (request, response, next) => {
    InvoiceSchema.find({doctorId: request.params.id})
        .then((data) => {
            if (data != null) response.status(200).json(data);
            else {
                next(new ErrorResponse("no invoices for this doctor"));
            }
        })
        .catch((error) => {
            next(new ErrorResponse(error.message));
        });
};
