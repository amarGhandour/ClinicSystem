const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const clinicServicesController = require("../controllers/clinicController");
const {
  clinicValidation,
  clinicValidationForPatch,
  idValidation,
} = require("../middlewares/dataValidator");
const validator = require("../middlewares/errorValidator");
const {queryBuilder} = require("../middlewares/queryBuilder");
const {authorize} = require("../middlewares/authMW");

router.get("/", authorize('admin'), queryBuilder, clinicServicesController.getClinicServices);
router.post(
    "/", authorize('admin'), clinicValidation, validator, clinicServicesController.addClinicServices
);

router.patch("/:id", authorize('admin'), clinicValidationForPatch, clinicServicesController.updateClinicServices
);

router.delete("/", authorize('admin'), clinicServicesController.deleteClincServices);

router.route('/:id').all(authorize('admin'))
    .get(idValidation, validator, clinicServicesController.getClinicById)
    .delete(idValidation, validator, clinicServicesController.deleteClinicById);

module.exports = router;
