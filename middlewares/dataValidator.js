const { body, query, param, validationResult } = require("express-validator");
let medicineValidation = [
  body("name").isString().withMessage("Medicine Name must be String"),
  body("quantity").isInt().withMessage("Quantity must be number"),
  body("expireDate")
    .isDate()
    .withMessage("Expire Date must be a date (year-month-day)"),
  body("productionDate")
    .isDate()
    .withMessage("Expire Date must be a date (year-month-day)"),
  body("price").isFloat().withMessage("Price must be number 0.000"),
];
let medicinceIdValidation = param("id")
  .isInt()
  .withMessage("id should be number ");
module.exports = { medicinceIdValidation, medicineValidation };
