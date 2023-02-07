const mongoose = require('mongoose');
const autoIncrement = require("mongoose-sequence")(mongoose);
const Prescription= require("./../models/Prescription");
const ErrorResponse = require("../utils/ErrorResponse");
const { findOne } = require('../models/clinic');

const prescriptionschema = mongoose.model("prescriptions");
const DoctorSchema = mongoose.model("doctors");
const patientSchema = mongoose.model("patients");
const ClinicShema = mongoose.model("clinic");


exports.getAllPrescriptionsByAdmin= (request, response, next) => {
    let sortBy;
    let fields;
    let reqQuery = { ...request.query };
    const removedFields = ["select", "sort", "page", "limit"];
    removedFields.forEach((el) => delete reqQuery[el]);
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    if (request.query.select) {
      const selectedFields = request.query.select.split(",");
      fields = convertTOmongooseSchema(selectedFields).join(" ");
    }
    if (request.query.sort) {
      const sortByfields = request.query.sort.split(",");
      sortBy = convertTOmongooseSchema(sortByfields).join(" ");
    } else {
      sortBy = "drugs";
    }
    let page = parseInt(request.query.page) || 1;
    let limit = parseInt(request.query.limit) || 100;
    let skip = (page - 1) * limit;
  
    prescriptionschema.find(JSON.parse(queryStr))
      .select(fields)
      .sort(sortBy)
      .limit(limit)
      .skip(skip)
    .then((result) => {
        response.status(200).json(result);
      }) 
        .catch((err) => next(new ErrorResponse(err.message, 500)));
}

exports.getAllPrescriptionsByDoctorId = async (request, response, next) => {
    try{
  let doctor=  await DoctorSchema.findOne({_id:request.params.doctorId})
    if (!doctor) return response.status(200).json("this id Doctor is not found", 403)
   let prescription= await prescriptionschema.find({doctorId:request.params.doctorId})
     response.status(201).json({message: "success",prescription})
}catch(error){
    next(new ErrorResponse(err.message));
}
}
exports.getAllPrescriptionsByPatientId = async (request, response, next) => {
    try{
    let patient=  await patientSchema.findOne({_id:request.params.patientId})
    if (!patient) return response.status(200).json("this id patient is not found", 403)
    let prescription= await prescriptionschema.find({patientId:request.params.patientId})
        response.status(201).json({message: "success",prescription})
    
      }catch(error){
        next(new ErrorResponse(err.message));
    }  
}
exports.getAllPrescriptionsByClinictId = async (request, response, next) => {
    try{
 let clinic= await ClinicShema.findOne({_id:request.params.clinicId})
 if (!clinic) return response.status(200).json("this id clinic is not found", 403)
    let prescription=  await prescriptionschema.find({clinicId:request.params.clinicId})
        response.status(201).json({message: "success",prescription})
    
      }catch(error){
        next(new ErrorResponse(err.message));
    }  
   
}


exports.addPrescriptionByDoctor= async (request, response, next) => {
    let doctor =await  DoctorSchema.findOne({_id:request.body.doctorId})    
    if (!doctor) return response.status(201).json("this id Doctor is not found", 422)
    let patient=  await patientSchema.findOne({_id:request.body.patientId})
    if (!patient) return response.status(201).json("this id patient is not found", 422)
    let clinic= await ClinicShema.findOne({_id:request.body.clinicId})
 if (!clinic) return response.status(201).json("this id clinic is not found", 422)
        let newPrescription = new Prescription({
            createdAt:request.body.createdAt,
            doctorId: request.body.doctorId,
            patientId: request.body.patientId,
            clinicId: request.body.clinicId,
            drugs: request.body.drugs,
             });
       newPrescription.save()
            .then(data => {
             
                if (data == null) throw new Error("something went wrong while adding new prescription")
                
              
                response.status(201).json({ message: "success", data });
            })
    }

    exports.updatePrescriptionByDoctor=async (request, response, next) => {

       await prescriptionschema.updateOne({_id:request.body._id},{
            $set:{drugs:request.body.drugs}
        }).then(data=>{
          console.log(data);
            response.status(201).json({ message: "success", data  });
    
        })
        .catch((err) => next(new ErrorResponse(err.message)));
    }

    exports.getPrescriptionBydAndDate= async(request,response,next)=>{
        let doctor=  await DoctorSchema.findOne({_id:request.params.doctorId})
    if (!doctor) return response.status(201).json("this id Doctor is not found", 403)
      await  prescriptionschema.find({_id:request.params.doctorId, createdAt:request.params.createdAt}).then(data=>{
            response.status(201).json({ message: "success", data})
        
          }).catch((err) => next(new ErrorResponse(err.message)));
        }

     

