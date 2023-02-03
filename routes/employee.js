const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const validator = require("./../Middlewares/errorValidator");
const {
  employeeValidation,
  employeeIdValidation,
} = require("./../Middlewares/dataValidator");
const controller = require("./../controllers/employee");

router
  .route("/")
  .get(controller.getAllEmployees)
  .post(employeeValidation, validator, controller.addEmployee)
  .patch(controller.updateEmployee);

router
  .route("/:id")
  .delete(employeeIdValidation, validator, controller.deleteEmployee)
  .get(employeeIdValidation, validator, controller.getEmployeeByID);

module.exports = router;
