const express = require("express");
const {body, query, param} = require("express-validator");
const { PrescriptionValidation,idValidation, PrescriptionValidationForPatch}= require("../middlewares/dataValidator");
const validator = require("../middlewares/errorValidator");
const controller = require("../Controllers/prescriptionController");
const router = express.Router();

router.route("/")
    .get(controller.getAllPrescriptionsByAdmin)
    .post(PrescriptionValidation,validator ,controller.addPrescriptionByDoctor)
    .patch(PrescriptionValidationForPatch,controller.updatePrescriptionByDoctor);
    router
    .get("/doctor/:doctorId", idValidation , controller.getAllPrescriptionsByDoctorId)
    .get("/patien/:patientId", idValidation , controller.getAllPrescriptionsByPatientId)
    .get("/clinic/:clinicId", idValidation , controller.getAllPrescriptionsByClinictId)
    .get("/:doctorId/:createdAt",idValidation ,controller.getPrescriptionBydAndDate);

module.exports = router;
