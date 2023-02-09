const express = require("express");
const router = express.Router();
const validator = require("./../Middlewares/errorValidator");
const {
  invoiceValidation,
  invoiceValidationForPatch,
  idValidation,
} = require("./../middlewares/dataValidator");
const controller = require("./../controllers/invoiceController");
const {authorize} = require("../middlewares/authMW");

  /**
     * @swagger
     * tags:
     *   name: Invoices
     *   description: API to Manage Invoices
     */
    
    /** 
     * @swagger
     *   /invoices:
     *     get:
     *       summary: Get all invoices
     *       tags: [Invoices]
     *       responses:
     *         "200":
     *           description: The list of invoices
     *           contents:
     *             application/json:
     *               schema:
     *                 $ref: '#/components/schemas/Invoice'
     *         "400":
     *           $ref: '#/components/responses/400'
     *         "401":
     *           $ref: '#/components/responses/401'
     */
    
   
   /** 
     * @swagger
     *   /invoices:
     *     post:
     *       summary: Create a invoices
     *       tags: [Invoices]
     *       requestBody:
     *         required: true
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Invoice'
     *       responses:
     *         "400":
     *           $ref: '#/components/responses/400'
     *         "401":
     *           $ref: '#/components/responses/401'
     *         "200":
     *           $ref: '#/components/responses/200'
     *         "201":
     *           description: Invoice created successfully
     *           contents:
     *             application/json
     */
    
 

/** 
 * @swagger
 *   /invoices/{id}:
 *     get:
 *       summary: Get Invoice By his ID
 *       tags: [Invoices]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Id of a Invoice
 *       responses:
 *         "200":
 *           description: The Invoice
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Invoice'
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "404":
 *           $ref: '#/components/responses/404'
 */


/** 
 * @swagger
 *   /invoices/doctorInvoices/{id}:
 *     get:
 *       summary: Get All Invoices By Doctor with his ID
 *       tags: [Invoices]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Id of a Doctor
 *       responses:
 *         "200":
 *           description: The Invoices
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Invoice'
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "404":
 *           $ref: '#/components/responses/404'
 */


/** 
 * @swagger
 *   /invoices/patientInvoices/{id}:
 *     get:
 *       summary: Get All Invoices By Patient with his ID
 *       tags: [Invoices]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Id of a Patient
 *       responses:
 *         "200":
 *           description: The Invoice
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Invoice'
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "404":
 *           $ref: '#/components/responses/404'
 */
/** 
 * @swagger
 *   /invoices/{id}:
 *     delete:
 *       summary: Delete a invoice
 *       tags: [Invoices]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Id of a invoice
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

router
    .route("/").all(authorize('admin'))
    .get(controller.getAllInvoices)
    .post(authorize('admin', 'employee'), invoiceValidation, validator, controller.addInvoice)
    .patch(authorize('admin', 'employee'), invoiceValidationForPatch, validator, controller.updateInvoice);

router
    .route("/:id").all(authorize('admin', 'employee'))
    .delete(idValidation, validator, controller.deleteInvoice)
    .get(idValidation, validator, controller.getInvoiceByID);

router
    .route("/doctorInvoices/:id")
    .get(idValidation, validator, controller.getDoctorInvoices);

router
    .route("/patientInvoices/:id")
    .get(idValidation, validator, controller.getPatientInvoices);

module.exports = router;
