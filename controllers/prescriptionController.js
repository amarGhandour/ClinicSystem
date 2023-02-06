const mongoose = require('mongoose');
const autoIncrement = require("mongoose-sequence")(mongoose);
const Prescription= require("./../models/Prescription");
const ErrorResponse = require("../utils/ErrorResponse");
const { findOne } = require('../models/clinic');

const prescriptionschema = mongoose.model("prescriptions");
const DoctorSchema = mongoose.model("doctors");
const patientSchema = mongoose.model("patients");
const clinicSchema = mongoose.model("clinic");
exports.getAllPrescriptionsByAdmin= (request, response, next) => {

    prescriptionschema.find().populate({path:"patientId"}).populate({path:"doctorId"}).populate({path:"clinicId"}).populate({path:"drug"})
        .then((data) => {
            response.status(200).json(data);
        })
        .catch(error => next(error));
}

exports.getAllPrescriptionsByDoctorId = (request, response, next) => {
    DoctorSchema.findOne({_id:request.params.doctorId})
    .then(data=>{
        if (data == null) throw new Error("this prescription  Doctor is not found")
    })
    prescriptionschema.find({doctorId:request.params.doctorId}).then(data=>{
        response.status(201).json(data)
    
      }).catch(error=>next(error))

   
}
exports.getAllPrescriptionsByPatientId = (request, response, next) => {
    patientSchema.findOne({_id:request.params.patientId})
    .then(data=>{
        if (data == null) throw new Error("this prescription patient is not found")
    })
    prescriptionschema.find({patientId:request.params.patientId}).then(data=>{
        response.status(201).json(data)
    
      }).catch(error=>next(error))

   
}
exports.getAllPrescriptionsByClinictId = (request, response, next) => {
    clinicSchema.findOne({_id:request.params.clinicId})
    .then(data=>{
        if (data == null) throw new Error("this prescription clinic is not found")
    })
    prescriptionschema.find({clinicId:request.params.clinicId}).then(data=>{
        response.status(201).json(data)
    
      }).catch(error=>next(error))

   
}


exports.addPrescriptionByDoctor= (request, response, next) => {

    
        let newPrescription = new Prescription({
            createdAt:request.body.createdAt,
            //  new Date().toDateString("en-US",
            //     {
            //         day: 'numeric',
            //         month: 'numeric',
            //         year: 'numeric'
            //     }),
            doctorId: request.body.doctorId,
            patientId: request.body.patientId,
            clinicId: request.body.clinicId,
            drugs: request.body.drugs,
           
        });

        newPrescription.save()
            .then(data => {
                if (data == null) throw new Error("something went wrong while adding new prescription")
                response.status(201).json({ message: "added", data })
            })
    }
    exports.updatePrescriptionByDoctor= (request, response, next) => {

        prescriptionschema.updateOne({_id:request.body.id},{
            $set:{drugs:request.body.drugs}
        }).then(data=>{
            response.status(201).json({message:"update"})
    
        })
        .catch(error=>next(error))
    }
    exports.getPrescriptionBydAndDate=(request,response,next)=>{
        ChildSchmea.findOne({_id:request.params._id,createdAt:request.params.createdAt}).then(data=>{
            response.status(201).json(data)
        
          }).catch(error=>next(error))
        }


