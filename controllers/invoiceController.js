const mongoose = require("mongoose");
require("./../models/invoice");
const ErrorResponse = require("../utils/ErrorResponse");
const InvoiceSchema = mongoose.model("invoices");

exports.getAllInvoices = (request, response, next) => {
  InvoiceSchema.find()
    .populate([
      { path: "patients", select: "name" },
      { path: "doctor", select: "name" },
    ])
    .then((result) => {
      response.status(200).json(result);
    })
    .catch((error) => {
      next(new ErrorResponse(error.message));
    });
};
exports.addInvoice = (request, response, next) => {
  let newInvoice = new InvoiceSchema({
    ...request.body,
  });
  newInvoice
    .save()
    .then((result) => {
      response.status(200).json({ message: "success", result });
    })
    .catch((error) => {
      next(new ErrorResponse(error.message));
    });
};
exports.updateInvoice = (request, response, next) => {
  InvoiceSchema.updateOne(
    { _id: request.body._id },
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
      response.status(200).json({ message: "medicine updated" });
    })
    .catch((err) => next(new ErrorResponse(err.message)));
};

exports.deleteInvoice = (request, response, next) => {
  InvoiceSchema.delete({ _id: request.params.id })
    .then((result) => {
      response.status(201).json({ message: "Invoice has been deleted" });
    })
    .catch((err) => next(new ErrorResponse(err.message)));
};

exports.getInvoiceByID = (request, response, next) => {
  InvoiceSchema.findOne({ _id: request.params.id })
    .then((data) => {
      if (data != null)
      //
      response.status(200).json(data);
      else {
        next(new ErrorResponse("Invoice does not exist", 403));
      }
    })
    .catch((error) => next(error));
};

exports.getDoctorInvoices = (request, response, next) => {
  InvoiceSchema.find({ doctorId: request.params.id })
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => {
      next(new ErrorResponse(error.message));
    });
};
