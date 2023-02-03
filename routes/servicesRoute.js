const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const {
  serviceValidation,
  serviceIdValidation,
} = require("../middlewares/dataValidator");
const validator = require("../middlewares/errorValidator");
const servicesController = require("../controllers/servicesController");

router.get("/", 
servicesController.getServices);
router.post("/", 
serviceValidation,
validator,
servicesController.addService);
router.put("/", servicesController.updateServices);
router.delete("/", servicesController.deleteServices);

router
  .get(
    "/:id",
   serviceIdValidation,
    servicesController.getServiceById
  )
  .delete(
    "/:id",
    serviceIdValidation,
    servicesController.deleteServiceById
  );
module.exports = router;
