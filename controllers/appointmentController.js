const mongoose = require('mongoose');
const ErrorResponse = require("../utils/ErrorResponse");
require("./../models/appointment");
const appointmentSchema = mongoose.model("appointment");
const clinicSchema = mongoose.model("clinic");
const doctorSchema = mongoose.model("doctors");



exports.getAllAppointments = async (request, response, next) => {

    try {
        
     
        const reqQuery = { ...request.query };
    
        
        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];
     
        // Loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);
      
        // Create query string
        let queryStr = JSON.stringify(reqQuery);
      
        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
      
        // Finding resource
    let query = appointmentSchema.find(JSON.parse(queryStr))/*.populate({ path: "clinic",select:'name -_id' }).populate({ path: "patient",select:'name -_id' }).populate({ path: "doctor",select:'name -_id' })*/


        // select fields
    if (request.query.select)
    {
        const fields = request.query.select.split(',').join(' ');
        query = query.select(fields);
      }

        //sort
      if (request.query.sort) {
        const sortBy = request.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
      } else {
        query = query.sort('-createdAt'); //DEC sort
      }
    // pagination
    const page = parseInt(request.query.page, 10) || 1;
    const limit = parseInt(request.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
   const docNumber = await appointmentSchema.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

      //excute
        const appointments= await  query

        // pagination results
 
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



exports.addAppointment= async (request, response, next) => {   // to do if he dosnot work in the clinic for this day


    //check for clinic exists or not
     clinicSchema.findById(request.body.clinic)
    .then((clinic)=>{
  
     if(!clinic) // for Null
     {
     next(new ErrorResponse('clinic does not exist', 500));
     }
  
     
   


        //now if the clinic exist we check if the doctor exist and avalibale for the day
        doctorSchema.findById(request.body.doctor )
        .then(doctor=>{
            if(!doctor) // for Null
                {
                next(new ErrorResponse('doctor does not exist', 500));
                }


                // get the doctor clinics
                else if(!doctor.clinics.includes(request.body.clinic )) // not in
                {
                    next(new ErrorResponse('doctor does not work in this clinic ', 500));
                }
                
                else{

            //the doctor exist
            //check for the day and availabilty
           
            doctor.schedule.forEach(schedule => {
 
                    // check the day /available ? / does he work in the clinic
                    if( schedule.timeline.day===request.body.day 
                       &&schedule.clinic===request.body.clinic  )
                    {

                        if(schedule.timeline.available){
                           
                                    // check maxApp
                                    appointmentSchema.find({doctor:request.body.doctor ,day:request.body.day}) // add the day
                                    .then(app=>{

                                            
                                       

                                                        if(app.length <=schedule.timeline.maxApp ){
                                                            response.status(200).json({
                                                                success: true,
                                                                data: "newApp"
                                                            });
                                                            
                                                                // make new appoitment
                                                                let newAppointment = new appointmentSchema({
                                                                    patient: request.body.patient,
                                                                    clinic: request.body.clinic,
                                                                    doctor: request.body.doctor,
                                                                    payment: request.body.payment,
                                                                    day: request.body.day
                                                                })
                                                                newAppointment.save()
                                                                .then((newApp)=>{
                                                                    response.status(200).json({
                                                                        success: true,
                                                                        data: newApp
                                                                    });

                                                                })
                                
                                                            
                                                            }
                                                            else {
                                                                next(new ErrorResponse('No Appoitment Available', 404));
                                                            }


                                    })
                     
                                } // if for available
                                else{
                                    next(new ErrorResponse('Doctor is not Available', 404));
                                }
                       
                    }//end of if for doctor
                    
           
                });

             } //end of else for !doctor.clinic
            
        })
 
    })
    .catch((error) => {
     next(new ErrorResponse("error from add", 500));
   });
 

 
        
}

exports.updateAppointment = (request, response, next) => {
   //to do
   // check if the doctor work in this day

 appointmentSchema.findById(request.params.id )
 .then(oldApp=>{
    if(!oldApp) // for Null
    {
    next(new ErrorResponse('Appointment does not exist', 500));
    console.log(oldApp)
    }
 
else{
      doctorSchema.findById(oldApp.doctor )
      .then(doctor=>{
        
         doctor.schedule.forEach(schedule => {
 
            // check the day /available ? / does he work in the clinic
            //   //  //   //  //  is he available
            //   //  //  //  //   did he reach his appMax or not
            if(schedule.timeline.day===request.body.day  )
            {
                appointmentSchema.find({doctor:oldApp.doctor,day:request.body.day})
                .then(app=>{
                   
                 // start of update 
                   
                   if(app.length <=schedule.timeline.maxApp &&schedule.timeline.available===true){
                    appointmentSchema.updateOne({_id: request.params.id}, {
                        $set: {
                            day: request.body.day
                
                        }
                    })
                
                        .then((newDay) => {               
                            
                            response.status(200).json({
                                success: true,
                                Confirmation:`The Appointment Day Was changed to ${request.body.day}` 
                            });

                        })
                
                        
                   }//end of update
                   else{
                    next(new ErrorResponse("NO appointment available for this day ", 500));
                   }
                   

                   })// end of app
            }
   
      })//end of for each
      })//end of doctor schema
    
    }

 })




   

}


exports.getAppointmentByID = (request, response, next) => {
    appointmentSchema.findOne({ _id: request.params.id })
    .then((data) => {
      if (data != null) response.status(200).json(data);
      else {
        next(new ErrorResponse(" does not exist", 403));
      }
    })
    .catch((error) => next(error));
};

exports.deleteAppointment = (request, response, next) => {
    appointmentSchema.deleteOne({ _id: request.params.id })
      .then((result) => {
         // check if the exist or not
         if (result.deletedCount == 0) {
            let error = new Error("Appointment Not Found ");
            next(error);
        } else {
            response.status(201).json({message: "From Delete In Controller"})

        }
      })
      .catch((err) => next(err));
  };