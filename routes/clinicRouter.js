const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const clinicServicesController = require("../controllers/clinicController");

router.get("/", clinicServicesController.getClinicServices);

// todo get one resource of service

router.post(
  "/",
  //     body('name').isString().withMessage('Name must be a string'),
  //     body('location').isString().withMessage('Location must be a string'),
  // // body('phone').isInt().withMessage('Phone must be a Number'),
  //     body('email').isEmail().withMessage('Email must be a valid email'),
  //     body('website').isString().withMessage('Website must be a string'),
  //     body('description').isString().withMessage('Description must be a string'),
  //     body('services').isString().withMessage('Services must be a string'),
  //     body('hours').isInt().withMessage('Hours must be a number'),
  // body('appointments').isArray().withMessage('Appointments must be an array'),
  clinicServicesController.addClinicServices
);

router.put("/", clinicServicesController.updateClinicServices);

router.delete("/", clinicServicesController.deleteClincServices);
module.exports = router;
