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
const {authorize} = require("../middlewares/authMW");

router
    .route("/").all(authorize('admin'))
  .get(controller.getAllEmployees)
  .post(employeeValidation, validator, controller.addEmployee)
  .patch(employeeValidationForPatch, validator, controller.updateEmployee);

router
    .route("/:id").all(authorize('admin'))
  .delete(idValidation, validator, controller.deleteEmployee)
  .get(idValidation, validator, controller.getEmployeeByID);

router
    .route("/activate/:id")
    .patch(authorize('admin'), employeeValidation, validator, controller.activateEmployee);
router
    .route("/deactivate/:id")
    .patch(authorize('admin'), employeeValidation, validator, controller.deactivateEmployee);
module.exports = router;
