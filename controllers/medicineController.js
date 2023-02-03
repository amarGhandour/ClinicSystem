const mongoose = require("mongoose");
require("./../models/medicine");
const ErrorResponse = require("../utils/ErrorResponse");
const MedicineSchema = mongoose.model("medicine");

exports.addMedicine = (request, response, next) => {
  let newMedicine = new MedicineSchema({
    _id: request.body.id,
    drugName: request.body.name,
    drugQuantity: request.body.quantity,
    productionDate: request.body.productionDate,
    expireDate: request.body.expireDate,
    pricePerUnit: request.body.price,
  });
  newMedicine
    .save()
    .then((result) => {
      response.status(201).json(result);
    })
    .catch((err) => next(new ErrorResponse(err.message)));
};

exports.updateMedicine = (request, response, next) => {
  MedicineSchema.updateOne(
    { _id: request.body.id },
    {
      $set: {
        drugName: request.body.name,
        drugQuantity: request.body.quantity,
        expireDate: request.body.expireDate,
        productionDate: request.body.productionDate,
        pricePerUnit: request.body.price,
      },
    }
  )
    .then((result) => {
      response.status(200).json({ message: "medicine updated" });
    })
    .catch((err) => next(new ErrorResponse(err.message)));
};
exports.deleteMedicine = (request, response, next) => {
  MedicineSchema.deleteOne({ _id: request.params.id })
    .then((result) => {
      response.status(201).json({ message: "Drug has been deleted" });
    })
    .catch((err) => next(new ErrorResponse(err.message)));
};
exports.getAllMedicine = (request, response, next) => {
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
    sortBy = "drugName";
  }
  let page = parseInt(request.query.page) || 1;
  let limit = parseInt(request.query.limit) || 100;
  let skip = (page - 1) * limit;

  MedicineSchema.find(JSON.parse(queryStr))
    .select(fields)
    .sort(sortBy)
    .limit(limit)
    .skip(skip)
    .then((result) => {
      response.status(200).json(result);
    })
    .catch((error) => {
      next(new ErrorResponse(error.message));
    });
};

exports.getMedicineByID = (request, response, next) => {
  MedicineSchema.findOne({ _id: request.params.id })
    .then((data) => {
      if (data != null) response.status(200).json(data);
      else {
        next(new ErrorResponse("Drug does not exist", 403));
      }
    })
    .catch((error) => next(error));
};

function convertTOmongooseSchema(data) {
  let schemaFields = [];
  for (let i = 0; i < data.length; i++) {
    switch (data[i]) {
      case "name":
        schemaFields.push("drugName");
        break;
      case "quantity":
        schemaFields.push("drugQuantity");
        break;
      case "expireDate":
        schemaFields.push("expireDate");
        break;
      case "productionDate":
        schemaFields.push("productionDate");
        break;
      case "price":
        schemaFields.push("pricePerUnit");
        break;
    }
  }
  return schemaFields;
}
