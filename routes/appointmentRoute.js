const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const {appointmentValidation} = require("./../Middlewares/dataValidator");

const validator = require("./../Middlewares/errorValidator");
const controller = require("./../controllers/appointmentController");
router
  .route("/")
  .get(controller.getAllAppointments)
  .post(appointmentValidation,validator, controller.addAppointment)
  

router
  .route("/:id")
  .delete(controller.deleteAppointment)
  .patch(controller.updateAppointment)
  .get( controller.getAppointmentByID);

module.exports = router;
