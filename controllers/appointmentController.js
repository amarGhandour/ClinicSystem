const mongoose = require('mongoose');
const ErrorResponse = require("../utils/ErrorResponse");
require("./../models/appointment");
const AppointmentSchema = mongoose.model("appointment");
const ClinicSchema = mongoose.model("clinic");
const DoctorSchema = mongoose.model("doctors");
const PatientSchema = mongoose.model("patients");


exports.getAllAppointments = async (request, response, next) => {

    try {
        const reqQuery = {...request.query};

        const removeFields = ['select', 'sort', 'page', 'limit'];

        removeFields.forEach(param => delete reqQuery[param]);

        let queryStr = JSON.stringify(reqQuery);

        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        let query = AppointmentSchema.find(JSON.parse(queryStr))/*.populate({ path: "clinic",select:'name -_id' }).populate({ path: "patient",select:'name -_id' }).populate({ path: "doctor",select:'name -_id' })*/

        if (request.query.select) {
            const fields = request.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        if (request.query.sort) {
            const sortBy = request.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt'); //DEC sort
        }

        const page = parseInt(request.query.page, 10) || 1;
        const limit = parseInt(request.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const docNumber = await AppointmentSchema.countDocuments(JSON.parse(queryStr));

        query = query.skip(startIndex).limit(limit);

        const appointments = await query

        const pagination = {};
        if (endIndex < docNumber) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }

        response.status(200).json({
            success: true,
            pagination,
            data: appointments
        });
    } catch (error) {
        next(new ErrorResponse('Error ', 500));
    }
}

exports.addAppointment = async (request, response, next) => {

    try {
        let clinic = await ClinicSchema.findById(request.body.clinic);

        if (!clinic)
            return next(new ErrorResponse("clinic not found.", 422));

        let patient = await PatientSchema.findById(request.body.patient);
        if (!patient)
            return next(new ErrorResponse("patient not found", 422));

        let doctor = await DoctorSchema.findById(request.body.doctor);
        if (!doctor)
            return next(new ErrorResponse("doctor not found", 422));

        if (!doctor.clinics.includes(request.body.clinic)) {
            return next(new ErrorResponse('doctor does not work in this clinic ', 422));
        }

        let appointments = await AppointmentSchema.find({
            doctor: request.body.doctor,
            day: request.body.day,
            clinic: request.body.clinic
        });

        console.log(appointments);

        let isAppointmentFound = false;
        for (let i = 0; i < doctor.schedule.length; i++) {

            console.log(doctor.schedule[i].timeline.day === request.body.day
                , doctor.schedule[i].clinic === request.body.clinic && doctor.schedule[i].timeline.available,
                appointments.length <= doctor.schedule[i].timeline.maxApp)

            if (doctor.schedule[i].timeline.day === request.body.day
                && doctor.schedule[i].clinic === request.body.clinic && doctor.schedule[i].timeline.available &&
                appointments.length <= doctor.schedule[i].timeline.maxApp) {

                console.log("here")
                isAppointmentFound = true;
                break;
            }
        }

        if (!isAppointmentFound) {
            return response.status(200).json({
                success: false,
                msg: "No available new appointments."
            });

        }

        let newAppointment = new AppointmentSchema({
            patient: request.body.patient,
            clinic: request.body.clinic,
            doctor: request.body.doctor,
            payment: request.body.payment,
            day: request.body.day
        })
        newAppointment.save()
            .then((newApp) => {
                response.status(201).json({
                    success: true,
                    data: newApp
                });
            }).catch();

    } catch (e) {
        return next(new ErrorResponse(e.message));
    }

}

exports.updateAppointment = async (request, response, next) => {

    try {
        let appointment = await AppointmentSchema.findById(request.params.id);

        if (!appointment)
            return next(new ErrorResponse('Appointment does not exist', 404));

        let doctor = await DoctorSchema.findById(appointment.doctor);

        let scheduleIndex = -1;
        for (let i = 0; i < doctor.schedule.length; i++) {
            if (appointment.clinic === doctor.schedule[i].clinic && doctor.schedule[i].timeline.day === request.body.day
                && doctor.schedule[i].timeline.available) {
                scheduleIndex = i;
                break;
            }
        }

        if (scheduleIndex === -1) {
            return response.status(200).json({
                success: true,
                msg: "No available appointments in this day."
            });
        }

        let appointments = await AppointmentSchema.find({doctor: appointment.doctor, day: request.body.day})

        if (appointments.length <= doctor.schedule[scheduleIndex].timeline.maxApp) {

            AppointmentSchema.updateOne({_id: request.params.id}, {
                $set: {
                    day: request.body.day
                }
            }).then((newDay) => {
                response.status(201).json({
                    success: true
                });
            })
        } else {
            response.status(200).json({
                success: true,
                msg: "no available appointments"
            });
        }
    } catch (e) {
        return next(new ErrorResponse(e.message));
    }

}


exports.getAppointmentByID = (request, response, next) => {
    AppointmentSchema.findOne({_id: request.params.id})
        .then((data) => {
            response.status(200).json({
                success: true,
                data: data
            });
        })
        .catch((error) => next(new ErrorResponse(" does not exist", 422)));
};

exports.deleteAppointment = (request, response, next) => {
    AppointmentSchema.deleteOne({_id: request.params.id})
        .then((result) => {
            response.status(204).json({success: true})
        })
        .catch((err) => next(new ErrorResponse(err.message)));
};