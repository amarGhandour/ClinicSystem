const {body, query, param, validationResult} = require("express-validator");
const ErrorResponse = require("../utils/ErrorResponse");
require("../models/patient");
require("../models/doctor");
require("../models/employee");

const mongoose = require("mongoose");

const PatientSchema = mongoose.model("patients");
const DoctorSchema = mongoose.model("doctors");
const EmployeeSchema = mongoose.model("employee");

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
    body("location").isObject().withMessage("Location is Not valid"),
    body("location.city").isString().withMessage("City must be String"),
    body("location.street").isString().withMessage("Street must be String"),
    body("location.buildingNumber")
        .isInt()
        .withMessage("Building Number must be number"),
    body("phone")
        .matches(/^01[0125][0-9]{8}$/)
        .withMessage("Mobile Number must be 11 number"),
    body("email")
        .isEmail()
        .matches(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
        .withMessage("Email must be email"),
    body("description").isString().withMessage("Description must be String"),

    body("services").isArray().withMessage("Services must be array "),
    body("services.*.name").isString().withMessage("Service Name must be String"),
    body("services.*.price").isFloat().withMessage("Price must be number 0.000"),
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
        .isInt({min: 3000, max: 5000})
        .withMessage("Salary must be number"),
    body("email")
        .isString()
        .optional()
        .withMessage("Username must be string and unique"),
    body("password")
        .isStrongPassword()
        .optional()
        .withMessage("Password must be Strong password"),
    body("age")
        .isInt({min: 25, max: 60})
        .withMessage("age must be interger between 25:60")
        .optional(),
    body("activate").isBoolean().withMessage("activate takes boolean value"),
];
let employeeValidation = [
    body("name").isString().withMessage("Medicine Name must be String"),
    body("mobileNumber")
        .optional()
        .isMobilePhone()
        .matches(/^(010|012|015)-\d{8}$/)
        .withMessage("mobile number must be 012|015|010-X8"),
    body("clinic").isInt().withMessage("ClinicID must be number"),
    body("salary")
        .isInt({min: 3000, max: 5000})
        .withMessage("Salary must be number"),
    body("email").isString().withMessage("Username must be string and unique"),
    body("password")
        .isStrongPassword()
        .withMessage("Password must be Strong password"),
    body("age")
        .isInt({min: 25, max: 60})
        .withMessage("age must be interger between 25:60"),
    body("activate")
        .isBoolean()
        .withMessage("activate takes boolean value")
        .optional(),
];

let doctorValidation = [
    body("age")
        .isInt({min: 25, max: 60})
        .withMessage("age should be Integer between 25 and 60"),
    body("name").isLength({max: 30}).withMessage("Name must be <30"),
    body("password")
        .isStrongPassword()
        .withMessage("password must be strong")
        .isLength({min: 8, max: 20}),
    body("email").isEmail().withMessage("Invalid Email"),
    body("specilization").isString().withMessage("Specilization must be string"),
    body("clinics").isArray().withMessage("Clinics must be entered as an array"),
    body("clinics.*").isInt().withMessage("Each clinic Id must be number"),
    body("schedule")
        .isArray()
        .withMessage("schedule must be entered as an array"),
    body("price").isInt().withMessage("examination price must be number"),
];


let doctorValidationForPatch = [
    body("age")
        .isInt({min: 25, max: 60})
        .withMessage("age should be Integer between 25 and 60").optional(),
    body("name").isLength({max: 30}).withMessage("Name must be <30").optional(),
    body("password")
        .isStrongPassword()
        .withMessage("password must be strong")
        .isLength({min: 8, max: 20}).optional(),
    body("email").isEmail().withMessage("Invalid Email").optional(),
    body("specilization").isString().withMessage("Specilization must be string").optional(),
    body("clinics").isArray().withMessage("Clinics must be entered as an array").optional(),
    body("clinics.*").isInt().withMessage("Each clinic Id must be number").optional(),
    body("schedule")
        .isArray()
        .withMessage("schedule must be entered as an array").optional(),
    body("price").isInt().withMessage("examination price must be number").optional(),
];

let checkEmailUnique = async function (email) {
    let isEmailExist = null;
    isEmailExist = await PatientSchema.exists({email: email});

    if (isEmailExist) {
        throw new ErrorResponse("Email is exist", 422);
    }

    isEmailExist = await DoctorSchema.exists({email: email});
    if (isEmailExist) {
        throw new ErrorResponse("Email is exist", 422);
    }

    isEmailExist = await EmployeeSchema.exists({email: email});
    if (isEmailExist) {
        throw new ErrorResponse("Email is exist", 422);
    }

    return isEmailExist;
};
let invoiceValidation = [
    body("patientId").isInt().withMessage("patientId must be integer"),
    body("doctorId").isInt().withMessage("doctorId must be integer"),
    body("clinic").isInt().withMessage("clinic must be integer"),
    body("services").isArray().withMessage("services must be array of objects"),
    body("services.*.name").isString("service name should be string"),
    body("services.*.price").isInt().withMessage("service price should be a number."),
    body("paymentMethod")
        .isIn(["cash", "Credit Card", "Insurance Card"])
        .withMessage("paymentMethod must be cash|| credit Card || Insurance Card")
        .optional(),
];
let invoiceValidationForPatch = [
    body("patientId").isInt().withMessage("patientId must be integer").optional(),
    body("doctorId").isInt().withMessage("doctorId must be integer").optional(),
    body("paymentMethod")
        .isIn(["cash", "Credit Card", "Insurance Card"])
        .withMessage("paymentMethod must be cash|| credit Card || Insurance Card")
        .optional(),
    body("clinic").isInt().withMessage("clinic must be integer").optional(),
    body("services").isArray().withMessage("services must be array of objects").optional(),
    body("services.*.name").isString("service name should be string").optional(),
    body("services.*.price").isInt().withMessage("service price should be a number.").optional()
];

let appointmentValidation = [
    body("clinic").isInt().withMessage("clinic must be integer"),
    body("doctor").isInt().withMessage("doctor must be integer"),
    body("patient").isInt().withMessage("patient must be integer"),
    body("payment").isIn(["cash", "visa"]).withMessage("Invalid payment method"),
];
let prescriptionValidation = [
    body("doctorId").isInt().withMessage("doctor id is required"),
    body("patientId").isInt().withMessage("patient id is required"),
    body("clinicId").isInt().withMessage("clinicid is required"),
    body("drugs").isArray().withMessage("drug is array"),
    body("drugs.*.drug").isString().withMessage("drug id is required"),
    body("drugs.*.details").isString().withMessage("details is string"),
];
let prescriptionValidationForPatch = [
    body("doctorId").isInt().withMessage("doctor id is required").optional(),
    body("patientId").isInt().withMessage("patient id is required").optional(),
    body("clinicId").isInt().withMessage("clinicid is required").optional(),
    body("drugs").isArray().withMessage("drug is array").optional(),
    body("drugs.*.drug").isString().withMessage("drug id is required").optional(),
    body("drugs.*.details")
        .isString()
        .withMessage("details is string")
        .optional(),
];

let paymentCashValidation = [
    body("doctorId").isInt().withMessage("doctor must be integer"),
    body("patientId").isInt().withMessage("patient must be integer"),
];

let loginValidation = [
    body("email").isEmail().withMessage("email must match email formula xxx@xxx.xxx"),
    body("password").isStrongPassword().withMessage("password must be strong"),
];


let registerValidation = [
    body("age")
        .isInt({min: 25, max: 60})
        .withMessage("age should be Integer between 25 and 60"),
    body("name").isLength({max: 30}).withMessage("Name must be <30"),
    body("password")
        .isStrongPassword()
        .withMessage("password must be strong")
        .isLength({min: 8, max: 20}),
    body("email").isEmail().withMessage("Invalid Email")
];

let patientValidation = [
    body("age").isInt().withMessage("age should be Integer"),
    body("name").isLength({max: 30}).withMessage("Name must be <30"),
    body("password").isString().withMessage("password must be strong")
        .isLength({min: 1, max: 20}),
    body("email").isEmail().withMessage("Invalid Email"),
]

let patientValidationForPatch = [
    body("age").isInt().withMessage("age should be Integer").optional(),
    body("name").isLength({max: 30}).withMessage("Name must be <30").optional(),
    body("password").isString().withMessage("password must be strong").optional()
        .isLength({min: 1, max: 20}),
    body("email").isEmail().withMessage("Invalid Email").optional(),
]

module.exports = {
    paymentCashValidation,
    medicineValidation,
    medicineValidationForPatch,
    clinicValidation,
    employeeValidation,
    employeeValidationForPatch,
    doctorValidation,
    clinicValidationForPatch,
    idValidation,
    appointmentValidation,
    checkEmailUnique,
    invoiceValidation,
    invoiceValidationForPatch,
    prescriptionValidation,
    prescriptionValidationForPatch,
    loginValidation,
    registerValidation,
    doctorValidationForPatch,
    patientValidationForPatch,
    patientValidation
};
