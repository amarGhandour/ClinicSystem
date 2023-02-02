const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const servicesController = require("../controllers/servicesController");

router.get("/", servicesController.getServices);
router.post("/", servicesController.addService);
router.put("/", servicesController.updateServices);
router.delete("/", servicesController.deleteServices);

//get by id
router.get("/:id", servicesController.getServiceById);
router.delete("/:id", servicesController.deleteServiceById);
module.exports = router;
