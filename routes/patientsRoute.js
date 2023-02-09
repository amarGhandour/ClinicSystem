const express = require("express");
const {body, query, param} = require("express-validator");
const controller = require("./../controllers/patientController")
const validator = require("./../Middlewares/errorValidator")
const {authorize} = require("../middlewares/authMW");
const {patientValidation, patientValidationForPatch, idValidation} = require("../middlewares/dataValidator");
const router = express.Router();


  /**
     * @swagger
     * tags:
     *   name: Patients
     *   description: API to Manage Patients
     */
    
    /** 
     * @swagger
     *   /patients:
     *     get:
     *       summary: Get all Patients
     *       tags: [Patients]
     *       responses:
     *         "200":
     *           description: The list of Patients
     *           contents:
     *             application/json:
     *               schema:
     *                 $ref: '#/components/schemas/Patient'
     *         "400":
     *           $ref: '#/components/responses/400'
     *         "401":
     *           $ref: '#/components/responses/401'
     */
    
    /** 
     * @swagger
     *   /patients:
     *     post:
     *       summary: Create a Patient
     *       tags: [Patients]
     *       requestBody:
     *         required: true
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Patient'
     *       responses:
     *         "400":
     *           $ref: '#/components/responses/400'
     *         "401":
     *           $ref: '#/components/responses/401'
     *         "201":
     *           description: Patient created successfully
     *           contents:
     *             application/json
     */



/** 
 * @swagger
 *   /patients/{id}:
 *     delete:
 *       summary: Delete a Patient
 *       tags: [Patients]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Id of a Patient
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "204":
 *           description: Review deleted successfully
 *           contents:
 *             application/json
 */

/** 
 * @swagger
 *   /patients/{id}:
 *     get:
 *       summary: Get Patient By his ID
 *       tags: [Patients]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Id of a Patient
 *       responses:
 *         "200":
 *           description: The Patient
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Patient'
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "404":
 *           $ref: '#/components/responses/404'
 */



router.route("/").all(authorize('admin'))
    .get(controller.getAllPatients)
    .post(
        patientValidation, validator, controller.addPatient)
    .patch(patientValidationForPatch, validator, controller.updatePatient);


router.get("/:id",idValidation
    ,
    validator,
    authorize('admin'),controller.getPatientByID);

router.delete("/:id",authorize('admin'), idValidation, validator, controller.deletePatient);



module.exports = router;