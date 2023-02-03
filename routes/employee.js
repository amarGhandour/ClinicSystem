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
    .post(validator, controller.addEmployee)
    .patch(validator, controller.updateEmployee);

router
  .route("/:id")
  .delete(idValidation, validator, controller.deleteEmployee)
  .get(idValidation, validator, controller.getEmployeeByID);

module.exports = router;
