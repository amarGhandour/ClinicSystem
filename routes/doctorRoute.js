const express = require("express");
const router = express.Router();
const {body, query, param, validationResult} = require("express-validator");
const validator = require("./../Middlewares/errorValidator");
const {
    doctorValidation,
    idValidation,
} = require("./../Middlewares/dataValidator");
const controller = require("./../controllers/doctorController");
const {authorize} = require("../middlewares/authMW");

router.all(authorize('admin'))
    .route("/")
    .get(controller.getAllDoctors)
    .post(doctorValidation, validator, controller.addDoctor)
    .patch(controller.updateDoctor);

router
    .route("/:id").all(authorize('admin'))
    .delete(idValidation, validator, controller.deleteDoctor)
    .get(idValidation, validator, controller.getDoctorByID);

module.exports = router;
