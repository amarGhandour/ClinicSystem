const services = require("../models/services");
const ErrorResponse = require("../utils/ErrorResponse");

//* Get all services
exports.getServices = (req, res, next) => {
  services
    .find()
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

//* Create a new  service
exports.addService = (req, res, next) => {
  console.log(req.body);
  const newservices = new services({
    name: req.body.name,
    description: req.body.description,
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
      next(new ErrorResponse("Service could not be added"));
      res.status(500).json({
        // message: "Orthopedic Services could not be added",
        // error: err
      });
    });
};

//* Update a service
exports.updateServices = (req, res, next) => {
  console.log(req.body);
  const services = new services({
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
      next(new ErrorResponse("Services could not be updated"));
      res.status(500).json({
        // message: "Orthopedic Services could not be updated",
        // error: err
      });
    });
};
//* Delete a orthopedic service
exports.deleteServices = (req, res, next) => {
  services
    .deleteOne({ _id: req.params.id })
    .then((result) => {
      res.status(200).json({
        success: true,
        data: result,
      });
    })
    .catch((err) => {
      next(new ErrorResponse("Services could not be deleted"));
      res.status(500).json({
        // message: "Orthopedic Services could not be deleted",
        // error: err
      });
    });
};

//* Get  service by id
exports.getServiceById = (req, res, next) => {
  services
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
//* delete service by id
exports.deleteServiceById = (req, res, next) => {
  services
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
