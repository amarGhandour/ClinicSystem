const express = require("express");
const router = express.Router();
const {body, query, param, validationResult} = require("express-validator");
const {reviewValidation, reviewValidationForPatch} = require("./../Middlewares/dataValidator");

const validator = require("./../Middlewares/errorValidator");
const controller = require("./../controllers/reviewsController");


/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API to Manage Reviews
 */

/**
 * @swagger
 *   /reviews:
 *     get:
 *       summary: Get all reviews
 *       tags: [Reviews]
 *       responses:
 *         "200":
 *           description: The list of Reviews
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Review'
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 */

/**
 * @swagger
 *   /reviews:
 *     post:
 *       summary: Create a Review
 *       tags: [Reviews]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "201":
 *           description: Book created successfully
 *           contents:
 *             application/json
 */

/**
 * @swagger
 *   /reviews/{id}:
 *     patch:
 *       summary: Update a Review
 *       tags: [Reviews]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Id of a Review
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *               required:
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "204":
 *           description: Review updated successfully
 *           contents:
 *             application/json
 */

/**
 * @swagger
 *   /reviews/{id}:
 *     delete:
 *       summary: Delete a review
 *       tags: [Reviews]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Id of a book
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
 *   /reviews/{id}:
 *     get:
 *       summary: Get Reviews For A Doctor By his ID
 *       tags: [Reviews]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Id of a Doctor
 *       responses:
 *         "200":
 *           description: The Reviews
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Review'
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "404":
 *           $ref: '#/components/responses/404'
 */
router
    .route('/')
    .get(
        controller.getReviews)
    .post(reviewValidation, validator, controller.addReview)

router
    .route('/:id')
    .get(controller.getReviewsForDoctor)
    .patch(reviewValidationForPatch, validator, controller.updateReview)
    .delete(controller.deleteReview);

module.exports = router;
