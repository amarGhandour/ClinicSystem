const express = require("express");
const { body, query, param } = require("express-validator");
const {
  prescriptionValidation,
  idValidation,
  prescriptionValidationForPatch,
} = require("../middlewares/dataValidator");
const validator = require("../middlewares/errorValidator");
const controller = require("../Controllers/prescriptionController");
const { authorize } = require("../middlewares/authMW");
const router = express.Router();

router
  .route("/")
  .get(authorize("admin"), controller.getAllPrescriptions)
  .post(
    authorize("admin", "doctor"),
    prescriptionValidation,
    validator,
    controller.addPrescription
  )
  .patch(
    authorize("admin", "doctor"),
    prescriptionValidationForPatch,
    validator,
    controller.updatePrescription
  );

router
<<<<<<< HEAD
  .get(
    "/doctor/:doctorId",
    authorize("admin", "doctor"),
    idValidation,
    validator,
    controller.getAllPrescriptionsForDoctor
  )
  .get(
    "/patient/:patientId",
    idValidation,
    validator,
    controller.getAllPrescriptionsForPatient
  );
=======
    .get("/doctor/:doctorId", authorize('admin', 'doctor'), idValidation, validator, controller.getAllPrescriptionsForDoctor)
    .get("/patient/:patientId", idValidation, validator, controller.getAllPrescriptionsForPatient)
>>>>>>> e850c2a37c92c1ef155d72964e1c2a9b50a2aa1e

router.patch(
  "/:id/addDrug",
  authorize("admin", "doctor"),
  idValidation,
  prescriptionValidationForPatch,
  validator,
  controller.addDrugToPrescription
);
router.patch(
  "/:id/removeDrug",
  authorize("admin", "doctor"),
  idValidation,
  prescriptionValidationForPatch,
  validator,
  controller.removeDrugFromPrescription
);

module.exports = router;
