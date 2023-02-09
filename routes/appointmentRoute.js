const express = require("express");
const router = express.Router();
const {body, query, param, validationResult} = require("express-validator");
const {appointmentValidation} = require("./../Middlewares/dataValidator");

const validator = require("./../Middlewares/errorValidator");
const controller = require("./../controllers/appointmentController");
const {authorize} = require("../middlewares/authMW");
router
    .route("/")
    .get(authorize('admin'), controller.getAllAppointments)
    .post(authorize('admin', 'patient', 'employee'), appointmentValidation, validator, controller.addAppointment)


router
    .route("/:id").all(authorize('admin', 'patient'))
    .delete(controller.deleteAppointment)
    .patch(controller.updateAppointment)
    .get(authorize('employee'), controller.getAppointmentByID);

module.exports = router;
