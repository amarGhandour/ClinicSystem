const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const validator = require("./../Middlewares/errorValidator");
const {
  employeeValidation,
  idValidation,
  employeeValidationForPatch,
} = require("./../Middlewares/dataValidator");
const controller = require("./../controllers/employee");

router
  .route("/")
  .get(controller.getAllEmployees)
  .post(employeeValidation, validator, controller.addEmployee)
  .patch(employeeValidationForPatch, validator, controller.updateEmployee);

router
  .route("/:id")
  .delete(idValidation, validator, controller.deleteEmployee)
  .get(idValidation, validator, controller.getEmployeeByID);
router
  .route("/activate/:id")
  .patch(employeeValidation, validator, controller.activateEmployee);
router
  .route("/deactivate/:id")
  .patch(employeeValidation, validator, controller.deactivateEmployee);
module.exports = router;
