const express = require("express");
const {body, query, param} = require("express-validator");
const {prescriptionValidation, idValidation, prescriptionValidationForPatch} = require("../middlewares/dataValidator");
const validator = require("../middlewares/errorValidator");
const controller = require("../Controllers/prescriptionController");
const {authorize} = require("../middlewares/authMW");
const router = express.Router();





















router.route("/")
    .get(authorize('admin'), controller.getAllPrescriptions)
    .post(authorize('admin', 'doctor'), prescriptionValidation, validator, controller.addPrescription)
    .patch(authorize('admin', 'doctor'), prescriptionValidationForPatch, validator, controller.updatePrescription);

router
    .get("/doctor/:id", authorize('admin', 'doctor'), idValidation, validator, controller.getAllPrescriptionsForDoctor)
    .get("/patient/:id", idValidation, validator, controller.getAllPrescriptionsForPatient)

router.patch("/:id/addDrug", authorize('admin', 'doctor'), idValidation, prescriptionValidationForPatch, validator, controller.addDrugToPrescription);
router.patch("/:id/removeDrug", authorize('admin', 'doctor'), idValidation, prescriptionValidationForPatch, validator, controller.removeDrugFromPrescription)

module.exports = router;
