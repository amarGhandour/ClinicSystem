const express = require("express");
const multer = require("multer");
const fs = require('fs');
const {body, query, param} = require("express-validator");
const controller = require("./../controllers/patientController")
const validator = require("./../Middlewares/errorValidator")
const {authorize} = require("../middlewares/authMW");
const {patientValidation, patientValidationForPatch, idValidation} = require("../middlewares/dataValidator");
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toDateString() + file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 //5 = 5m
    },
});


router.route("/").all(authorize('admin'))
    .get(controller.getAllPatients)
    .post(
        upload.single('image'),
        patientValidation, validator, controller.addPatient)
    .patch(patientValidationForPatch, validator, controller.updatePatient);


router.get("/:id", idValidation
    ,
    validator,
    authorize('admin'), controller.getPatientByID);

router.delete("/:id", authorize('admin'), idValidation, validator, controller.deletePatient);


module.exports = router;