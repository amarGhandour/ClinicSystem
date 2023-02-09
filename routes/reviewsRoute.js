const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const {reviewValidation,reviewValidationForPatch} = require("./../Middlewares/dataValidator");

const validator = require("./../Middlewares/errorValidator");
const controller = require("./../controllers/reviewsController");


router
  .route('/')
  .get(
    controller.getReviews)
  .post(reviewValidation,validator,controller.addReview)
  
router
  .route('/:id')
  .get(controller.getReviewsForDoctor) 
  .patch(reviewValidationForPatch,validator, controller.updateReview)
  .delete(controller.deleteReview);

module.exports = router;
