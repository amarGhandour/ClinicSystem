const mongoose = require('mongoose');
const ErrorResponse = require("../utils/ErrorResponse");
require("./../models/review");
const ReviewSchema = mongoose.model("reviews");
const DoctorSchema = mongoose.model("doctors");


exports.getReviews = (request, response, next) => {
    ReviewSchema.find()
        .then((reviews) => {
            response.status(200).json({
                success: true,

                data: reviews
            });
        })
        .catch((Error) => {
            next(new ErrorResponse('Error 1 ', 500));
        })
};


exports.getReviewsForDoctor = (request, response, next) => {
    ReviewSchema.find({doctor: request.params.id})
        .then((data) => {
            if (data != null) response.status(200).json(data);
            else {
                next(new ErrorResponse(" does not exist", 403));
            }
        })
        .catch((Error) => {
            next(new ErrorResponse('Error 1 ', 500));
        })
};

exports.addReview = (request, response, next) => {
    let newReview = new ReviewSchema({
        title: request.body.title,
        text: request.body.text,
        rating: request.body.rating,
        doctor: request.body.doctor,
        patient: request.body.patient
    })
    newReview.save()
        .then((newRVW) => {
            response.status(200).json({
                success: true,
                data: newRVW
            });
        })
        .catch((Error) => {
            next(new ErrorResponse('Error', 500));

        })
};

exports.updateReview = (request, response, next) => {

    ReviewSchema.updateOne({_id: request.params.id}, {
        $set: {

            title: request.body.title,
            text: request.body.text,
            rating: request.body.rating,
            doctor: request.body.doctor,
            patient: request.body.patient

        }
    })

        .then((data) => {
            if (data.modifiedCount == 0) {
                next(new ErrorResponse('No Data Was Updated', 304));

            } else {
                response.status(200).json({
                    success: true,
                    data: "Updated"
                });
            }
        })

        .catch(error => next(new ErrorResponse('Error', 400)))

};


exports.deleteReview = (request, response, next) => {
    console.log(request.params.id)
    ReviewSchema.deleteOne({_id: request.params.id})
        .then((result) => {

            if (result.deletedCount == 0) {
                next(new ErrorResponse("Error Review Not Found", 404))
            } else {
                response.status(200).json({
                    success: true,
                    data: {}
                });
            }

        })
        .catch((err) => next(new ErrorResponse("Error ", 400)));
};
