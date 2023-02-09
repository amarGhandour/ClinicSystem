const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const validator = require("./../Middlewares/errorValidator");
const {
  doctorValidation,
  idValidation,
} = require("./../Middlewares/dataValidator");
const controller = require("./../controllers/doctorController");

router
    .route("/")
    .get(controller.getAllDoctors)
    .post(doctorValidation, validator, controller.addDoctor)
  .patch(controller.updateDoctor);

router
  .route("/:id")
  .delete(idValidation, validator, controller.deleteDoctor)
  .get(idValidation, validator, controller.getDoctorByID);

module.exports = router;
