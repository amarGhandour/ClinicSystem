const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const validator = require("./../Middlewares/errorValidator");
const {
  DoctorValidation,
  idValidation,
} = require("./../Middlewares/dataValidator");
const controller = require("./../controllers/doctorController");

router
  .route("/")
  .get(controller.getAllDoctors)
  .post(DoctorValidation, validator, controller.addDoctor)
  .patch(controller.updateDoctor);

router
  .route("/:id")
  .delete(idValidation, validator, controller.deleteDoctor)
  .get(idValidation, validator, controller.getDoctorByID);

module.exports = router;
