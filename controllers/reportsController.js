const  mongoose  = require("mongoose");
require("./../models/doctor");
require("./../models/patient");
require("./../models/invoice");
require("./../models/appointment");
//require("./../models/report");
const InvoiceSchema = mongoose.model("invoices");
const appointmentSchema = mongoose.model("appointment");
const ErrorResponse = require("../utils/ErrorResponse");
const reportCreation = require("../utils/reportCreation");

exports.getAllInvoicesForReport = (req, res, next) => {
  let invoiceCount = InvoiceSchema.countDocuments().then((count) => {
    return count;
  });
  if (req.queryBuilder.skip >= invoiceCount)
    throw new Error("This page does not exist");

  InvoiceSchema.find().populate([
    { path: "patientId", select: "name" },
    { path: "doctorId", select: "name" },
  ])
    .sort(req.queryBuilder.sortBy)
    .select(req.queryBuilder.limitFields)
    .limit(req.queryBuilder.limit)
    .skip(req.queryBuilder.skip)
   
    .then((result) => {
      reportCreation.createReportForAllInvoices(result);

      return res.status(200).json({ success: true, data: result });
    })
    .catch((error) => {
      return next(new ErrorResponse(error.message));
    });
};

exports.getInvoiceByIdForReport = (req, res, next) => {
  InvoiceSchema.findOne({ _id: req.params.id }) .populate([
    { path: "patientId", select: "name" },
    { path: "doctorId", select: "name" },
    
  ])
    .then((result) => {
      reportCreation.createReportForInvoiveById(result);

      return res.status(200).json({ success: true, data: result });
    })
    .catch((err) => {
      next(new ErrorResponse(err.message, 500));
    });
};

exports.getAllAppointmentForReport = (req, res, next) => {
  let appointmentCount = appointmentSchema.countDocuments().then((count) => {
    return count;
  });
  if (req.queryBuilder.skip >= appointmentCount)
    throw new Error("This page does not exist");

  appointmentSchema
    .find()
    .sort(req.queryBuilder.sortBy)
    .select(req.queryBuilder.limitFields)
    .limit(req.queryBuilder.limit)
    .skip(req.queryBuilder.skip)
    .populate("patient", "name")
    .populate("doctor", "name")
    .populate("clinic", "name")

    .then((result) => {
      reportCreation.createReportForAllAppointments(result);

      return res.status(200).json({ success: true, data: result });
    })
    .catch((error) => {
      return next(new ErrorResponse(error.message));
    });}

exports.getAppointmentByIdForReport = (req, res, next) => {
  console.log(req.params.id);

  appointmentSchema
    .findOne({ _id: req.params.id }).populate("patient", "name")
    .populate("doctor", "name")
    .populate("clinic", "name")
    .then((result) => {
      reportCreation.createReportForAppointmentById(result);

      return res.status(200).json({ success: true, data: result });
    })
    .catch((err) => {
      next(new ErrorResponse(err.message, 500));
    });
}



//*view engine >> res.render("index", { result: result });
