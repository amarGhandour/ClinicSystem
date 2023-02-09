const Clinic = require("../models/clinic");
const ErrorResponse = require("../utils/ErrorResponse");

exports.getClinicServices = (req, res, next) => {
    let clinicCount = Clinic.countDocuments().then((count) => {
        return count;
    });
  if (req.queryBuilder.skip >= clinicCount)
    throw new Error("This page does not exist");

  //let query =
    Clinic.find(JSON.parse(req.queryBuilder.queryStr))
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

    const clinic = new Clinic({
        name: req.body.name,
        location: req.body.location,
        phone: req.body.phone,
        email: req.body.email,
        description: req.body.description,
        services: req.body.services,
    });

    clinic
        .save()
        .then((result) => {
            return res.status(201).json({
                success: true,
                data: result,
            });
        })
        .catch((err) => {
            next(new ErrorResponse(err.message, 500));
            n
        });
};

exports.updateClinicServices = async(req, res, next) => {
    const clinic = await Clinic.findById(req.params.id);

    if (!clinic)
        return res.status(404).json({success: false, data: "Clinic not found"});

    Clinic
        .findOneAndUpdate(
            {_id: req.params.id},

            {
                $set: {
                    name: req.body.name,
                    location: req.body.location,
                    phone: req.body.phone,
                    email: req.body.email,
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
    Clinic.deleteOne({_id: req.body.id})
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
    Clinic.findById(req.params.id)
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
    Clinic.findByIdAndDelete(req.params.id)
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
