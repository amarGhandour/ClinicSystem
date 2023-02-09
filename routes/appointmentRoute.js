const express = require("express");
const router = express.Router();
const {body, query, param, validationResult} = require("express-validator");
const {appointmentValidation} = require("./../Middlewares/dataValidator");

const validator = require("./../Middlewares/errorValidator");
const controller = require("./../controllers/appointmentController");
const {authorize} = require("../middlewares/authMW");


/**
     * @swagger
     * tags:
     *   name: Appointments
     *   description: API to Manage Appointments
     */
    
    /** 
     * @swagger
     *   /appointments:
     *     get:
     *       summary: Get all Appointments
     *       tags: [Appointments]
     *       responses:
     *         "200":
     *           description: The list of Appointments
     *           contents:
     *             application/json:
     *               schema:
     *                 $ref: '#/components/schemas/Appointment'
     *         "400":
     *           $ref: '#/components/responses/400'
     *         "401":
     *           $ref: '#/components/responses/401'
     */
    
    /** 
     * @swagger
     *   /appointments:
     *     post:
     *       summary: Create a Appointment
     *       tags: [Appointments]
     *       requestBody:
     *         required: true
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Appointment'
     *       responses:
     *         "400":
     *           $ref: '#/components/responses/400'
     *         "401":
     *           $ref: '#/components/responses/401'
     *         "201":
     *           description: Appointment created successfully
     *           contents:
     *             application/json
     */
    
/** 
 * @swagger
 *   /appointments/{id}:
 *     patch:
 *       summary: Update a Appointment
 *       tags: [Appointments]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Id of a Appointment
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *               required:
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "204":
 *           description: Appointment updated successfully
 *           contents:
 *             application/json
 */

/** 
 * @swagger
 *   /appointments/{id}:
 *     delete:
 *       summary: Delete a Appointment
 *       tags: [Appointments]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Id of an Appointment
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "204":
 *           description: Appointment deleted successfully
 *           contents:
 *             application/json
 */

/** 
 * @swagger
 *   /appointments/{id}:
 *     get:
 *       summary: Get Appointment By his ID
 *       tags: [Appointments]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Appointment ID
 *       responses:
 *         "200":
 *           description: The Appointment
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Appointment'
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "404":
 *           $ref: '#/components/responses/404'
 */








router
    .route("/")
    .get(
       // authorize('admin'),
     controller.getAllAppointments)
    .post(
        
       // authorize('admin', 'patient', 'employee'),
         appointmentValidation, validator, controller.addAppointment)


router
    .route("/:id").all(authorize('admin', 'patient'))
    .delete(controller.deleteAppointment)
    .patch(controller.updateAppointment)
    .get(authorize('admin', 'employee'), controller.getAppointmentByID);

module.exports = router;
