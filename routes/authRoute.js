const express = require('express');
const authController = require("../controllers/authController");
const router = express.Router();
const authMW = require("./../middlewares/authMW");

const {body, query, param, validationResult} = require("express-validator");
const validator = require("../middlewares/errorValidator");
const {loginValidation} = require('./../middlewares/dataValidator')
const {registerValidation} = require("../middlewares/dataValidator");

router.post('/register', registerValidation, validator, authController.register);
router.post('/login', loginValidation, validator, authController.login);
router.post('/logout', authMW, authController.logout);
router.get('/getMe', authMW, authController.getMe);

module.exports = router;