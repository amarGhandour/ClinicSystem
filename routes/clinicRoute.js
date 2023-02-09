const express = require("express");
const router = express.Router();
const {body, query, param, validationResult} = require("express-validator");
const clinicServicesController = require("../controllers/clinicController");
const {
    clinicValidation,
    clinicValidationForPatch,
    idValidation,
} = require("../middlewares/dataValidator");
const validator = require("../middlewares/errorValidator");
const {authorize} = require("../middlewares/authMW");

router.route("/").all(authorize("admin"))
    .get(clinicServicesController.getClinicServices)
    .post(authorize('employee'), clinicValidation, validator, clinicServicesController.addClinicServices);

router
    .patch(
        "/:id", authorize('admin', 'employee'),
        clinicValidationForPatch,
        clinicServicesController.updateClinicServices
    );

router.route("/:id").all(authorize('admin'))
    .get(idValidation, validator, clinicServicesController.getClinicById)
    .delete(idValidation, validator, clinicServicesController.deleteClinicById);

module.exports = router;
