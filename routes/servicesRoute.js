const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const {
  serviceValidation,
  idValidation,
} = require("../middlewares/dataValidator");
const validator = require("../middlewares/errorValidator");
const servicesController = require("../controllers/servicesController");

router.get("/", servicesController.getServices);
router.post("/", serviceValidation, validator, servicesController.addService);
router.put("/", servicesController.updateServices);
router.delete("/", servicesController.deleteServices);

router
  .get("/:id", idValidation, servicesController.getServiceById)
  .delete("/:id", idValidation, servicesController.deleteServiceById);
module.exports = router;
