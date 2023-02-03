const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const clinicServicesController = require("../controllers/clinicController");
const {
  clinicValidation,
  idValidation,
} = require("../middlewares/dataValidator");
const validator = require("../middlewares/errorValidator");

router.get("/", clinicServicesController.getClinicServices);
router.post(
  "/",
  clinicValidation,
  validator,
  clinicServicesController.addClinicServices
);
router.put("/:id", clinicServicesController.updateClinicServices);
router.delete("/", clinicServicesController.deleteClincServices);
router
  .get(
    "/:id",
    idValidation,
    validator,
    clinicServicesController.getClinicById
  )
  .delete(
    idValidation,
    validator,
    clinicServicesController.deleteClinicById
  );

module.exports = router;
