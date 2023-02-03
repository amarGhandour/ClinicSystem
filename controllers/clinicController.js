const ClinicServices = require("../models/clinic");
const ErrorResponse = require("../utils/ErrorResponse");

exports.getClinicServices = (req, res, next) => {
  //build query
  const queryObject = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObject[el]);
  //build the query string
  let queryStr = JSON.stringify(queryObject);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  let sortBy = req.query.sort
    ? req.query.sort.split(",").join(" ")
    : "-createdAt";
  let limitFields = req.query.fields
    ? req.query.fields.split(",").join(" ")
    : "-__v";
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 100;
  let skip = (page - 1) * limit;
  // Network request
  let clinicCount = ClinicServices.countDocuments().then((count) => {
    return count;
  });
  if (skip >= clinicCount) throw new Error("This page does not exist");
  //Execute the query

  //let query =
  ClinicServices.find(JSON.parse(queryStr))
    .populate([{ path: "services", select: "name" }])
    .sort(sortBy)
    .select(limitFields)
    .limit(limit)
    .skip(skip)

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



exports.addClinicServices = (req, res, next) => {
  console.log(req.body);
  const clinicServices = new ClinicServices({
    name: req.body.name,
    location: req.body.location,
    phone: req.body.phone,
    email: req.body.email,
    description: req.body.description,
    services: req.body.services,
  });
  clinicServices
    .save()
    .then((result) => {
      return res.status(201).json({
        success: true,
        data: result,
      });
    })
    .catch((err) => {
      next(new ErrorResponse(err.message, 500));
    });
};


exports.updateClinicServices = (req, res, next) => {
  const clinicServices = new ClinicServices({
    name: req.body.name,
    location: req.body.location,
    phone: req.body.phone,
    email: req.body.email,
    website: req.body.website,
    description: req.body.description,
    services: req.body.services,
  });
  clinicServices
    .updateOne({ _id: req.params.id }, clinicServices)
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


exports.deleteClincServices = (req, res, next) => {
  ClinicServices.deleteOne({ _id: req.body.id })
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

exports.getClinicById = (req, res, next) => {
  ClinicServices.findById(req.params.id)
    .then((result) => {
      res.status(200).json({
        success: true,
        data: result,
      });
    })
    .catch((err) => {
      next(new ErrorResponse("Clinic Services could not be found"));
      res.status(500).json({
        // message: "Clinic Services could not be found",
        // error: err
      });
    });
};

exports.deleteClinicById = (req, res, next) => {
  ClinicServices.findByIdAndDelete(req.params.id)
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
