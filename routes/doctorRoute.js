const express = require("express");
const multer = require('multer');
const fs = require ('fs');
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const validator = require("./../Middlewares/errorValidator");
const {
  DoctorValidation,
  idValidation,
} = require("./../Middlewares/dataValidator");
const controller = require("./../controllers/doctorController");

const storage = multer.diskStorage({
  destination : function ( req , file , cb ) {
    cb( null , './public/images/' );
  } ,
  filename : function ( req , file , cb ) {
    cb( null , new Date().toDateString() + file.originalname );
  } ,
});

const upload = multer({ 
  storage : storage ,
  limits : {
    fileSize : 1024*1024*5 //5 = 5m
  }, 
});


router
  .route("/")
  .get(controller.getAllDoctors)
  .post(
    upload.single('image'),
    DoctorValidation, validator, controller.addDoctor)
  .patch(controller.updateDoctor);

  // router.post('/uploadImage', 
  // upload.single('image'),
  //  (req, res, next) => {
  //   return res.send("File uploaded successfully");
  // });  

router
  .route("/:id")
  .delete(idValidation, validator, controller.deleteDoctor)
  .get(idValidation, validator, controller.getDoctorByID);

module.exports = router;
