const express = require("express");
const router = express.Router();
const {body, query, param, validationResult} = require("express-validator");
const {
    serviceValidation,
    idValidation,
    serviceValidationForPatch
} = require("../middlewares/dataValidator");
const validator = require("../middlewares/errorValidator");
const servicesController = require("../controllers/servicesController");
const {authorize} = require("../middlewares/authMW");

router.route('/').all(authorize('admin')).get(servicesController.getServices).post(serviceValidation, validator, servicesController.addService).patch(serviceValidationForPatch, validator, servicesController.updateServices).delete(servicesController.deleteServices);

router.route("/:id").all(authorize('admin'))
    .get(idValidation, servicesController.getServiceById)
    .delete(idValidation, servicesController.deleteServiceById);

module.exports = router;
