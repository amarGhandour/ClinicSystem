const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_KEY_SECRET);

require('../models/patient');
require('../models/doctor');
require('../models/invoice');

const ErrorResponse = require("../utils/ErrorResponse");
const {response} = require("express");

const PatientSchema = mongoose.model("patients");
const DoctorsSchema = mongoose.model("doctors");
const InvoiceSchema = mongoose.model("invoices");


exports.pay = async (request, response, next) => {

    // token should come from frontend
    const token = await stripe.tokens.create({
        card: {
            number: '4242424242424242',
            exp_month: 2,
            exp_year: 2024,
            cvc: '314',
        },
    });

    try {
        const patient = await PatientSchema.findOne({_id: request.id});

        if (!patient)
            return next(new ErrorResponse("patient not exist", 404));

        const doctor = await DoctorsSchema.findOne({_id: request.params.id});

        if (!doctor)
            return next(new ErrorResponse("doctor not exist", 404));

        stripe.customers.create({
            email: patient.email,
            source: token.id,
            name: patient.name,
        })
            .then((customer) => {
                // todo create payment service
                return stripe.charges.create({
                    amount: doctor.examPrice,
                    description: `${doctor.specilization} doctor examination.`,
                    currency: 'USD',
                    customer: customer.id
                });
            })
            .then((charge) => {
                let newInvoice = new InvoiceSchema({
                    patientId: patient._id,
                    doctorId: doctor._id,
                    status: "success",
                    total: request.body.price || doctor.examPrice,
                    paymentMethod: "Credit Card",
                    description: `${doctor.specilization} doctor examination.`,
                });
                newInvoice
                    .save()
                    .then((result) => {
                        response.status(201).json({
                            success: true
                        });
                    })
                    .catch((err) => next(new ErrorResponse(err.message)));
            })
            .catch((err) => {
                let newInvoice = new InvoiceSchema({
                    patientId: patient._id,
                    doctorId: doctor._id,
                    status: "failed",
                    total: request.body.price || doctor.examPrice,
                    paymentMethod: "Credit Card",
                    description: `${doctor.specilization} doctor examination.`,
                });
                newInvoice
                    .save();

                next(new ErrorResponse(err.message));
            });

    } catch (e) {
        return next(new ErrorResponse(e.message));
    }
}

exports.payCash = async (request, response, next) => {

    if (request.role === 'employee' && request.user.activate) {
        return next(new ErrorResponse("Not Authorized", 403));
    }
    try {
        const patient = await PatientSchema.findOne({_id: request.body.patientId});
        if (!patient)
            return next(new ErrorResponse("patient not exist", 404));

        const doctor = await DoctorsSchema.findOne({_id: request.body.doctorId});
        if (!doctor)
            return next(new ErrorResponse("doctor not exist", 404));

        let newInvoice = new InvoiceSchema({
            patientId: patient._id,
            doctorId: doctor._id,
            status: "success",
            total: doctor.examPrice,
            paymentMethod: "cash",
            description: `${doctor.specilization} doctor examination.`,
        });
        newInvoice
            .save().then((invoice) => {
            response.status(201).json({
                success: true,
            });
        })
            .catch(err => next(err.message));

    } catch (e) {
        return next(new ErrorResponse(e.message));
    }

}