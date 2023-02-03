const express = require("express");
const {body, query, param} = require("express-validator");
const controller = require("./../controllers/patientController")
const validator = require("./../Middlewares/errorValidator")
const {authorize} = require("../middlewares/authMW");
const router = express.Router();

router.route("/")
    .get(controller.getAllPatients)
    .post(
        [
            body("age").isInt().withMessage("age should be Integer"),
            body("name").isLength({max: 30}).withMessage("Name must be <30"),
            body("password").isString().withMessage("password must be strong")
                .isLength({min: 1, max: 20}),
            body("email").isEmail().withMessage("Invalid Email"),
        ], validator, controller.addPatient)
    .patch(controller.updateAllPatients)
    .delete(controller.deletePatient);


router.get("/:id", param("id").isInt().withMessage("id must be integer")
    ,
    validator,
    controller.getPatientByID);


module.exports = router;