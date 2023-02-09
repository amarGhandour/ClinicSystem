const { mongoose } = require("mongoose");
const InvoiceSchema = mongoose.model("invoices");
const ErrorResponse = require("../utils/ErrorResponse");
const reportCreation = require("../utils/reportCreation");


exports.getAllInvoicesForReport = (req, res, next) => {
  let invoiceCount = InvoiceSchema.countDocuments().then((count) => {
    return count;
  });
  if (req.queryBuilder.skip >= invoiceCount)
    throw new Error("This page does not exist");

  InvoiceSchema.find()
    .sort(req.queryBuilder.sortBy)
    .select(req.queryBuilder.limitFields)
    .limit(req.queryBuilder.limit)
    .skip(req.queryBuilder.skip)
    .then((result) => {
      reportCreation.createReportForAllInvoices(result);

      return res.status(200).json({ success: true, data: result });
    })
    .catch((error) => {
      return next(new ErrorResponse(error.message));
    });
};

exports.getInvoiceByIdForReport = (req, res, next) => {
  InvoiceSchema.findOne({ _id: req.params.id })
    .then((result) => {
     
      reportCreation.createReportForInvoiveById(result);

      return res.status(200).json({ success: true, data: result });
    })
    .catch((err) => {
      next(new ErrorResponse(err.message, 500));
    });
};

/*exports.getAllAppointmentForReport = (req, res, next) => {
InvoiceSchema.find().then((result) => {
        res.status(200).json({
            success: true,
            data: result,
        });
    }).catch((err) => {     
        next(new ErrorResponse(err.message, 500));
    });
}

exports.getAppointmentByIdForReport = (req, res, next) => {
InvoiceSchema.findOne({ _id: req.params.id }).then((result) => {
        if (result) {
            res.status(200).json({
                success: true,
                data: result,
            });
        } else {
            next(new ErrorResponse("Appointment does not exist", 403));
        }
    }).catch((err) => {
        next(new ErrorResponse(err.message, 500));
    });
}*/
//*view engine >> res.render("index", { result: result });
