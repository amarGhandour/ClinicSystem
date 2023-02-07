const mongoose = require("mongoose");
require("./../models/doctor");
require("./../models/clinic");
const ErrorResponse = require("../utils/ErrorResponse");
const {checkEmailUnique} = require("../middlewares/dataValidator");
const DoctorSchema = mongoose.model("doctors");
const ClinicShema = mongoose.model("clinic");

exports.getAllDoctors = (request, response, next) => {
  DoctorSchema.find()
    .populate([{ path: "clinics", select: "name" }])
    .then((result) => {
      response.status(200).json({
        success: true,
        data: result,
      });
    })
    .catch((err) => {
      next(new ErrorResponse(err.message, 500));
    });
};

exports.addDoctor = async (request, response, next) => {

  await checkEmailUnique(request.body.email).catch(err => next(err));

  let addedClinics = request.body.clinics;

  let clinicsId = await ClinicShema.find({}, {_id: 1});

  for (let i = 0; i < addedClinics.length; i++) {
    if (!clinicsId.find((existClinic) => existClinic._id == addedClinics[i])) {
      return next(
          new ErrorResponse("can't assign doctor to clinic dosen't exsit", 422)
      );
    }
  }

  let schedule = request.body.schedule;
  if (schedule) {
    for (let i = 0; i < schedule.length; i++) {
      if (!request.body.clinics.includes(schedule[i].clinic)) {
        return next(new ErrorResponse("Please enter one of Doctor Clinics"));
      }
    }
  }

  let newDoctor = new DoctorSchema({
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
    clinics: request.body.clinics,
    age: request.body.age,
    schedule: request.body.schedule,
    specilization: request.body.specilization,
    examPrice: request.body.price,
  });
  newDoctor
    .save()
    .then((result) => {
      response.status(201).json(result);
    })
    .catch((error) => next(new ErrorResponse(error.message)));
};

exports.updateDoctor = async (request, response, next) => {
  if (request.body.clinics) {
    let addedClinics = request.body.clinics;
    let clinicsId = await ClinicShema.find({}, { _id: 1 });
    console.log(clinicsId);
    for (let i = 0; i < addedClinics.length; i++) {
      if (
        !clinicsId.find((existClinic) => existClinic._id == addedClinics[i])
      ) {
        return next(
          new ErrorResponse("can't assign doctor to clinic dosen't exsit", 422)
        );
      }
    }
  }

  const doctor = await DoctorSchema.findById(request.body.id, { clinics: 1 });

  if (request.body.schedule) {
    let clinics = doctor.clinics;
    console.log(doctor);
    if (request.body.clinics) clinics = clinics.concat(request.body.clinics);
    console.log(clinics);
    let schedule = request.body.schedule;

    for (let i = 0; i < schedule.length; i++) {
      if (!clinics.includes(schedule[i].clinic)) {
        return next(new ErrorResponse("Please enter one of Doctor Clinics"));
      }
    }
  }

  DoctorSchema.updateOne(
    { _id: request.body.id },
    {
      $set: {
        name: request.body.name,
        email: request.body.email,
        password: request.body.password,
        age: request.body.age,
        schedule: request.body.schedule,
        specilization: request.body.specilization,
        examPrice: request.body.price,
      },
      $push: {
        clinics: request.body.clinics,
      },
    }
  )
    .then((result) => {
      response.status(201).json({
        success: result.acknowledged,
      });
    })
    .catch((error) => next(new ErrorResponse(error.message)));
};

exports.deleteDoctor = (request, response, next) => {
  DoctorSchema.deleteOne({ _id: request.params.id })
    .then((result) => {
      response.status(201).json({ message: "Doctor has been deleted" });
    })
    .catch((err) => next(new ErrorResponse(err.message)));
};

exports.getDoctorByID = (request, response, next) => {
  DoctorSchema.findOne({ _id: request.params.id })
    .then((data) => {
      if (data != null) response.status(200).json(data);
      else {
        next(new ErrorResponse("Doctor does not exist", 403));
      }
    })
    .catch((error) => next(error));
};
