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
let medicinceIdValidation  = param("id")
  .isInt()
  .withMessage("id should be number ");

  let clinicValidation = [
    body("name").isString().withMessage("Clinic Name must be String"),
    body("location").isArray().withMessage("Location must be array"),
    body("phone").matches(/^01[0125][0-9]{8}$/).withMessage("Mobile Number must be 11 number"),
    body("email").isEmail().matches(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/).withMessage("Email must be email"),
    body("description").isString().withMessage("Description must be String"),
  ];

  let clinicIdValidation = param("id").isInt().withMessage("Id should be number ");
  
  let serviceValidation = [
    body("name").isString().withMessage("Service Name must be String"),
    body("description").isAlpha().withMessage("Description must be Alphabet"),
  ];
  let serviceIdValidation = param("id").isInt().withMessage("Id should be number ");

module.exports = { medicinceIdValidation, medicineValidation , clinicValidation , clinicIdValidation , serviceValidation , serviceIdValidation};


