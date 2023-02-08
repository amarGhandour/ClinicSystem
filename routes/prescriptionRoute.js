const express = require("express");
const {body, query, param} = require("express-validator");
const {PrescriptionValidation, idValidation, PrescriptionValidationForPatch} = require("../middlewares/dataValidator");
const validator = require("../middlewares/errorValidator");
const controller = require("../Controllers/prescriptionController");
const router = express.Router();

router.route("/")
    .get(controller.getAllPrescriptions)
    .post(PrescriptionValidation, validator, controller.addPrescription)
    .patch(PrescriptionValidationForPatch, validator, controller.updatePrescription);
router
    .get("/doctor/:id", idValidation, validator, controller.getAllPrescriptionsForDoctor)
    .get("/patient/:id", idValidation, validator, controller.getAllPrescriptionsForPatient)

router.patch("/:id/addDrug", idValidation, PrescriptionValidationForPatch, validator, controller.addDrugToPrescription);
router.patch("/:id/removeDrug", idValidation, PrescriptionValidationForPatch, validator, controller.removeDrugFromPrescription)

module.exports = router;
