const express = require("express");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const validator = require("./../Middlewares/errorValidator");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toDateString() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, //5 = 5m
  },
});
const {
  doctorValidation,
  idValidation,
} = require("./../Middlewares/dataValidator");
const controller = require("./../controllers/doctorController");
const { authorize } = require("../middlewares/authMW");

router
  .all(authorize("admin"))
  .route("/")
  .get(controller.getAllDoctors)
  .post(
    upload.single("image"),
    doctorValidation,
    validator,
    controller.addDoctor
  )
  .patch(controller.updateDoctor);

router
  .route("/:id")
  .all(authorize("admin"))
  .delete(idValidation, validator, controller.deleteDoctor)
  .get(idValidation, validator, controller.getDoctorByID);

module.exports = router;
