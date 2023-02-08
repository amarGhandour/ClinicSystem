const express = require('express');
const router = express.Router();
const reportsController = require("../controllers/reportsController");
const {queryBuilder} = require("../middlewares/queryBuilder");
const {idValidation}= require("../middlewares/dataValidator");

router.get('/invoicesReports', queryBuilder,  reportsController.getAllInvoicesForReport);

//router.get('/appointmentsReports', reportsController.getAllAppointmentForReport); 


router.get('/invoicesReports/:id',idValidation, reportsController.getInvoiceByIdForReport);
//router.get('/appointmentsReports/:id',idValidation ,reportsController.getAppointmentByIdForReport);

module.exports = router;