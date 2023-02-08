const ClinicServices = require("../models/clinic");
const ErrorResponse = require("../utils/ErrorResponse");

exports.getClinicServices = (req, res, next) => {
  let clinicCount = ClinicServices.countDocuments().then((count) => {
    return count;
  });
  if (req.queryBuilder.skip >= clinicCount)
    throw new Error("This page does not exist");

  //let query =
  ClinicServices.find(JSON.parse(req.queryBuilder.queryStr))
    .populate([{ path: "services", select: "name" }])
    .sort(req.queryBuilder.sortBy)
    .select(req.queryBuilder.limitFields)
    .limit(req.queryBuilder.limit)
    .skip(req.queryBuilder.skip)

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
  const clinicServices = new ClinicServices();
  clinicServices
    .updateOne(
      { _id: req.params.id },

      {
        $set: {
          name: req.body.name,
          location: req.body.location,
          phone: req.body.phone,
          email: req.body.email,
          website: req.body.website,
          description: req.body.description,
          services: req.body.services,
        },
      }
    )
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
      next(new ErrorResponse("Clinic could not be found"));
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
