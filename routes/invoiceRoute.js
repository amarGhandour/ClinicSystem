const express = require("express");
const router = express.Router();
const validator = require("./../Middlewares/errorValidator");
const { idValidation } = require("./../middlewares/dataValidator");
const controller = require("./../controllers/invoiceController");

router
  .route("/")
  .get(controller.getAllInvoices)
  .post(validator, controller.addInvoice)
  .patch(validator, controller.updateInvoice);

router
  .route("/:id")
  .delete(idValidation, validator, controller.deleteInvoice)
  .get(idValidation, validator, controller.getInvoiceByID);

router.route("/doctorInvoices/:id").get(controller.getDoctorInvoices);
module.exports = router;
