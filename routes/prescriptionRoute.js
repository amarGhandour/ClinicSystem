const express = require("express");
const {body, query, param} = require("express-validator");
const {prescriptionValidation, idValidation, prescriptionValidationForPatch} = require("../middlewares/dataValidator");
const validator = require("../middlewares/errorValidator");
const controller = require("../Controllers/prescriptionController");
const router = express.Router();

router.route("/")
    .get(controller.getAllPrescriptions)
    .post(prescriptionValidation, validator, controller.addPrescription)
    .patch(prescriptionValidationForPatch, validator, controller.updatePrescription);
router
    .get("/doctor/:id", idValidation, validator, controller.getAllPrescriptionsForDoctor)
    .get("/patient/:id", idValidation, validator, controller.getAllPrescriptionsForPatient)

router.patch("/:id/addDrug", idValidation, prescriptionValidationForPatch, validator, controller.addDrugToPrescription);
router.patch("/:id/removeDrug", idValidation, prescriptionValidationForPatch, validator, controller.removeDrugFromPrescription)

module.exports = router;
