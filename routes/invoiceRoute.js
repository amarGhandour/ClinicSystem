const express = require("express");
const router = express.Router();
const validator = require("./../Middlewares/errorValidator");
const {
  invoiceValidation,
  invoiceValidationForPatch,
  idValidation,
} = require("./../middlewares/dataValidator");
const controller = require("./../controllers/invoiceController");
const {authorize} = require("../middlewares/authMW");

router
    .route("/").all(authorize('admin'))
    .get(controller.getAllInvoices)
    .post(authorize('admin', 'employee'), invoiceValidation, validator, controller.addInvoice)
    .patch(authorize('admin', 'employee'), invoiceValidationForPatch, validator, controller.updateInvoice);

router
    .route("/:id").all(authorize('admin', 'employee'))
    .delete(idValidation, validator, controller.deleteInvoice)
    .get(idValidation, validator, controller.getInvoiceByID);

router
    .route("/doctorInvoices/:id")
    .get(idValidation, validator, controller.getDoctorInvoices);

router
    .route("/patientInvoices/:id")
    .get(idValidation, validator, controller.getPatientInvoices);

module.exports = router;
