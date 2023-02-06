const express = require("express");
const {body, query, param} = require("express-validator");
const validator = require("./../Middlewares/errorValidator")
const controller = require("../Controllers/prescriptionController");
const router = express.Router();

router.route("/")
    .get(controller.getAllPrescriptionsByAdmin)
    
    .post([
        body("createdAt").isDate().withMessage("CreatedAt is required"),
        body("doctorId").isInt().withMessage("doctor id is required"),
        body("patientId").isInt().withMessage("patient id is required"),
        body("clinicId").isInt().withMessage("clinicid is required"),
        body("drugs").isArray().withMessage("drug is array"),
        body("drugs.*.drug").isInt().withMessage("drug id is required"),
        body("drugs.*.details").isString().withMessage("details is string")
    ],validator ,controller.addPrescriptionByDoctor)
    .patch(controller.updatePrescriptionByDoctor);
router.get("/:doctorId", controller.getAllPrescriptionsByDoctorId)
router.get("/:doctorId", controller.getAllPrescriptionsByPatientId)
router.get(":doctorId", controller.getAllPrescriptionsByClinictId)
router.get(":id/:date", controller.getPrescriptionBydAndDate)

module.exports = router;
