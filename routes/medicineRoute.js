const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const {
  medicineValidation,
  idValidation,
  medicineValidationForPatch,
} = require("./../Middlewares/dataValidator");
const validator = require("./../Middlewares/errorValidator");
const controller = require("./../controllers/medicineController");
router
  .route("/")
  .get(controller.getAllMedicine)
  .post(medicineValidation, validator, controller.addMedicine)
  .patch(medicineValidationForPatch, validator, controller.updateMedicine);

router
  .route("/:id")
  .delete(idValidation, validator, controller.deleteMedicine)
  .get(idValidation, validator, controller.getMedicineByID);

module.exports = router;
