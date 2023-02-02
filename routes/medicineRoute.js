const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const {
  medicineValidation,
  medicinceIdValidation,
} = require("./../Middlewares/dataValidator");
const validator = require("./../Middlewares/errorValidator");
const controller = require("./../controllers/medicineController");
router
  .route("/")
  .get(controller.getAllMedicine)
  .post(medicineValidation, validator, controller.addMedicine)
  .patch(controller.updateMedicine);

router
  .route("/:id")
  .delete(medicinceIdValidation, validator, controller.deleteMedicine)
  .get(medicinceIdValidation, validator, controller.getMedicineByID);

module.exports = router;
