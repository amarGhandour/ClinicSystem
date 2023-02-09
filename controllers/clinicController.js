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
   // .populate([{ path: "services", select: "name" }])
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
  //console.log(req.body.services[0].name);
  console.log(req.body.services[0].price);
  const services=[]
  req.body.services.forEach((service)=>{
    services.push({name: service.name, price: service.price})
  })

  const clinicServices = new ClinicServices({
    name: req.body.name,
    location: req.body.location,
    phone: req.body.phone,
    email: req.body.email,
    description: req.body.description,
    services

    //services: [{name: req.body.services[0].name, price: req.body.services[0].price}]
    
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
      next(new ErrorResponse(err.message, 500));n
    });
};

exports.updateClinicServices = async(req, res, next) => {
 const clinic = await ClinicServices.findById(req.params.id);

   if(!clinic)
   return  res.status(404).json({success: false, data: "Clinic not found"});
   
   const services = [];
   req.body.services.forEach((service)=>{
     services.push({name: service.name, price: service.price})
   })
 
   //services.push({name: req.body.services[0].name, price: req.body.services[0].price});
   console.log(services);
   ClinicServices
    .findOneAndUpdate(
      { _id: req.params.id },

      {
        $set: {
          name: req.body.name,
          location: req.body.location,
          phone: req.body.phone,
          email: req.body.email,
          description: req.body.description,
          services
         // services: [{name: req.body.services[0].name, price: req.body.services[0].price}]

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
