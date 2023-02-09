const express = require("express");
const {body, query, param} = require("express-validator");
const controller = require("./../controllers/patientController")
const validator = require("./../Middlewares/errorValidator")
const {authorize} = require("../middlewares/authMW");
const {patientValidation, patientValidationForPatch, idValidation} = require("../middlewares/dataValidator");
const router = express.Router();

router.route("/").all(authorize('admin'))
    .get(controller.getAllPatients)
    .post(
        patientValidation, validator, controller.addPatient)
    .patch(patientValidationForPatch, validator, controller.updateAllPatients);


router.get("/:id", param("id").isInt().withMessage("id must be integer")
    ,
    validator,
    authorize('admin'), controller.getPatientByID);

router.delete("/:id", authorize('admin'), idValidation, validator, controller.deletePatient);


module.exports = router;