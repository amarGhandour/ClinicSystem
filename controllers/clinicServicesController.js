const ClinicServices = require('../models/service');
const ErrorResponse = require("../utils/ErrorResponse");

exports.getClinicServices = (req, res, next) => {
    //build query
    const queryObject = {...req.query};
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObject[el]);
//build the query string
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let sortBy = req.query.sort ? req.query.sort.split(',').join(' ') : '-createdAt';
    let limitFields = req.query.fields ? req.query.fields.split(',').join(' ') : '-__v';
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 100;
    let skip = (page - 1) * limit;
    // Network request
    let clinicCount = ClinicServices.countDocuments().then((count) => {
        return count;
    })
    if (skip >= clinicCount) throw new Error('This page does not exist');
    //Execute the query

    let query = ClinicServices.find(JSON.parse(queryStr))
        .sort(sortBy)
        .select(limitFields)
        .limit(limit)
        .skip(skip)
        .then((result) => {
            res.status(200).json({
                success: true,
                clinicServices: result
            })
        })
        .catch((err) => {
            next(new ErrorResponse(err.message, 500))
        });

}

//* Create a new clinic service

exports.addClinicServices = (req, res, next) => {
    const clinicServices = new ClinicServices({
        name: req.body.name,
        location: req.body.location,
        // phone: req.body.phone,
        email: req.body.email,
        website: req.body.website,
        description: req.body.description,
        services: req.body.services,
        hours: req.body.hours
    })
    clinicServices.save()
        .then((result) => {
            res.status(201).json({
                message: "Clinic Services added successfully",
                clinicServices: result
            })
        })
        .catch((err) => {
            res.status(500).json({
                message: "Clinic Services could not be added",
                error: err
            })
        })
}

//* Update a clinic service

exports.updateClinicServices = (req, res, next) => {
    const clinicServices = new ClinicServices({
        _id: req.body._id,
        name: req.body.name,
        location: req.body.location,
        phone: req.body.phone,
        email: req.body.email,
        website: req.body.website,
        description: req.body.description,
        services: req.body.services,
        hours: req.body.hours
    })
    ClinicServices.updateOne({_id: req.params.id}, clinicServices)
        .then((result) => {
            res.status(200).json({
                message: "Clinic Services updated successfully",
                clinicServices: result
            })
        })
        .catch((err) => {
            res.status(500).json({
                message: "Clinic Services could not be updated",
                error: err
            })
        })
}

//* Delete a clinic service
exports.deleteClincServices = (req, res, next) => {
    ClinicServices.deleteOne({_id: req.body.id})
        .then((result) => {
            res.status(200).json({
                message: "Clinic Services deleted successfully",
                clinicServices: result
            })
        })
        .catch((err) => {
            res.status(500).json({
                message: "Clinic Services could not be deleted",
                error: err
            })
        })

}

