const {body, query, param, validationResult} = require("express-validator");
const ErrorResponse = require("../utils/ErrorResponse");
require('../models/patient');
require('../models/doctor');
require('../models/employee');

const mongoose = require("mongoose");

const patientSchema = mongoose.model("patients");
const doctorSchema = mongoose.model("doctors");
const employeeSchema = mongoose.model("employee");


let idValidation = param("id").isInt().withMessage("id should be number ");
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
let medicineValidationForPatch = [
  body("name")
    .isString()
    .optional()
    .withMessage("Medicine Name must be String"),
  body("quantity").isInt().optional().withMessage("Quantity must be number"),
  body("expireDate")
    .isDate()
    .optional()
    .withMessage("Expire Date must be a date (year-month-day)"),
  body("productionDate")
    .isDate()
    .optional()
    .withMessage("Expire Date must be a date (year-month-day)"),
  body("price").isFloat().optional().withMessage("Price must be number 0.000"),
];
let clinicValidation = [
  body("name").isString().withMessage("Clinic Name must be String"),
  body("location").isArray().withMessage("Location must be array"),
  body("phone")
    .matches(/^01[0125][0-9]{8}$/)
    .withMessage("Mobile Number must be 11 number"),
  body("email")
    .isEmail()
    .matches(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
    .withMessage("Email must be email"),
  body("description").isString().withMessage("Description must be String"),
];
let clinicValidationForPatch = [
  body("name").isString().optional().withMessage("Clinic Name must be String"),
  body("location").isArray().optional().withMessage("Location must be array"),
  body("phone")
    .matches(/^01[0125][0-9]{8}$/)
    .optional()
    .withMessage("Mobile Number must be 11 number"),
  body("email")
    .isEmail()
    .matches(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
    .optional()
    .withMessage("Email must be email"),
  body("description")
    .isString()
    .optional()
    .withMessage("Description must be String"),
];

let serviceValidation = [
  body("name").isString().withMessage("Service Name must be String"),
  body("description").isAlpha().withMessage("Description must be Alphabet"),
];
let serviceValidationForPatch = [
  body("name").isString().optional().withMessage("Service Name must be String"),
  body("description")
    .isAlpha()
    .optional()
    .withMessage("Description must be Alphabet"),
];
let employeeValidationForPatch = [
  body("name")
    .isString()
    .optional()
    .withMessage("Medicine Name must be String"),
  body("mobileNumber")
    .isMobilePhone()
    .optional()
    .matches(/^(010|012|015)-\d{8}$/)
    .withMessage("mobile number must be 012|015|010-X8"),
  body("clinic").isInt().optional().withMessage("ClinicID must be number"),
  body("salary")
    .optional()
    .isInt({ min: 3000, max: 5000 })
    .withMessage("Salary must be number"),
  body("username")
    .isString()
    .optional()
    .withMessage("Username must be string and unique"),
  body("password")
    .isStrongPassword()
    .optional()
    .withMessage("Password must be Strong password"),
];
let employeeValidation = [
  body("name").isString().withMessage("Medicine Name must be String"),
  body("mobileNumber").optional()
      .isMobilePhone()
      .matches(/^(010|012|015)-\d{8}$/)
      .withMessage("mobile number must be 012|015|010-X8"),
  // body("clinic").isInt().withMessage("ClinicID must be number"),
  body("salary")
      .isInt({min: 3000, max: 5000})
      .withMessage("Salary must be number"),
  body("email").isString().withMessage("Username must be string and unique"),
  body("password")
      .isStrongPassword()
      .withMessage("Password must be Strong password"),
];

let DoctorValidation = [
  body("age")
    .isInt({ min: 25, max: 60 })
      .withMessage("age should be Integer between 25 and 60"),
  body("name").isLength({max: 30}).withMessage("Name must be <30"),
  body("password")
      .isStrongPassword()
      .withMessage("password must be strong")
      .isLength({min: 8, max: 20}),
  body("email").isEmail().withMessage("Invalid Email"),
  body("specilization").isString().withMessage("Specilization must be string"),
  body("clinics").isArray().withMessage("Clinics must be entered as an array"),
  body("clinics.*").isNumeric().withMessage("Each clinic Id must be number"),
  body("schedule").isArray().withMessage("schedule must be entered as an array"),

];

let checkEmailUnique = async function (email) {
  let isEmailExist = null;
  isEmailExist = await patientSchema.exists({email: email});

  if (isEmailExist) {
    throw new ErrorResponse("Email is exist", 422);
  }

  isEmailExist = await doctorSchema.exists({email: email});
  if (isEmailExist) {
    throw new ErrorResponse("Email is exist", 422);
  }

  isEmailExist = await employeeSchema.exists({email: email});
  if (isEmailExist) {
    throw new ErrorResponse("Email is exist", 422);
  }

  return isEmailExist;
}

module.exports = {
  medicineValidation,
  medicineValidationForPatch,
  clinicValidation,
  serviceValidation,
  employeeValidation,
  employeeValidationForPatch,
  DoctorValidation,
  clinicValidationForPatch,
  serviceValidationForPatch,
  idValidation,
  checkEmailUnique
};
