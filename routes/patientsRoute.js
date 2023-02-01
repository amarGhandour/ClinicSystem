const express = require("express");
const {body, query, param} = require("express-validator");
const controller = require("./../controllers/patientController")
const validator = require("./../Middlewares/errorValidator")
const router = express.Router();

router.route("/")
    .get(controller.getAllPatients)
    .post(
        [
            body("id").isInt().withMessage("Id should be Integer"),
            body("doctor").isInt().withMessage("doctor should be Integer"),
            body("invoice").isInt().withMessage("invoice should be Integer"),
            body("age").isInt().withMessage("age should be Integer"),
            body("name").isString().withMessage("Name must be string").isLength({max: 30}).withMessage("Name must be <30"),
            body("password").isString().withMessage("password must be strong")
                .isLength({min: 1, max: 20}),
            body("email").isEmail().withMessage("Invalid Email"),

        ], validator, controller.addAllPatients)
    .patch(controller.updateAllPatients)
    .delete(controller.deletePatient);


router.get("/:id", param("id").isInt().withMessage("id must be integer"), validator, controller.getPatientByID)


module.exports = router;