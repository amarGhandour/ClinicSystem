const Services = require("../models/services");
const ErrorResponse = require("../utils/ErrorResponse");

exports.getServices = (req, res, next) => {
    Services
    .find()
    .populate([{ path: "clinic", select: "location" }])
    .then((result) => {
      res.status(200).json({
        success: true,
        data: result,
      });
    })
    .catch((err) => {
      next(new ErrorResponse(err.message, 500));
    });
};

exports.addService = (req, res, next) => {
  console.log(req.body);
    const newservices = new Services({
        name: req.body.name,
        description: req.body.description,
        clinic: req.body.clinic,
    });
  newservices
    .save()
    .then((result) => {
      res.status(201).json({
        success: true,
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
      next(new ErrorResponse(err.message, 500));
    });
};

exports.updateServices = (req, res, next) => {
  console.log(req.body);
    const services = new Services({
        name: req.body.name,
        description: req.body.description,
    });
  services
    .updateOne({ _id: req.params.id }, services)
    .then((result) => {
      res.status(200).json({
        success: true,
        data: result,
      });
    })
    .catch((err) => {
      next(new ErrorResponse(err.message, 500));
    });
};

exports.deleteServices = (req, res, next) => {
    Services
    .deleteOne({ _id: req.params.id })
    .then((result) => {
      res.status(200).json({
        success: true,
        data: result,
      });
    })
    .catch((err) => {
      next(new ErrorResponse(err.message, 500));
    });
};

exports.getServiceById = (req, res, next) => {
    Services
    .findById(req.params.id)
    .then((result) => {
      res.status(200).json({
        success: true,
        data: result,
      });
    })
    .catch((err) => {
      next(new ErrorResponse(err.message, 500));
    });
};

exports.deleteServiceById = (req, res, next) => {
    Services
    .findByIdAndDelete(req.params.id)
    .then((result) => {
      
      res.status(200).json({
        success: true,
        data: result,
      });
    })
    .catch((err) => {
      next(new ErrorResponse(err.message, 500));
    });
};
