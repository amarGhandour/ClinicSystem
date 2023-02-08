const { mongoose } = require("mongoose");
const doc = require("pdfkit");
const InvoiceSchema = mongoose.model("invoices");
const ErrorResponse = require("../utils/ErrorResponse");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");


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
      const name = "invoice Report" + new Date().getTime() + ".pdf";
      const filePath = path.join(__dirname, "..", "files", name);
      const doc = new PDFDocument({ size: "A3", margin: 20 });
      doc.pipe(fs.createWriteStream(filePath));

      doc.fontSize(16).text("CMS", 50, 50);
      doc.fontSize(16).text("Invoice Report", 50, 50, { align: "center" });
      // table header
      doc.fontSize(13).text("Created At", 50, 150);

      doc.fontSize(13).text("ID", 250, 150);
      doc.fontSize(13).text("Status", 350, 150);
      doc.fontSize(13).text("Total", 450, 150);
      doc.fontSize(13).text("Payment Method", 550, 150);

      result.forEach(function (obj, i) {
        doc
          .fontSize(12)
          .text(
            `${obj.createdAt.toLocaleDateString()} ${obj.createdAt.toLocaleTimeString()}`,
            50,
            200 + i * 32
          );
        doc.fontSize(12).text(`${obj._id}`, 250, 200 + i * 32);
        doc.fontSize(12).text(`${obj.status}`, 350, 200 + i * 32);
        doc.fontSize(12).text(`${obj.total}`, 450, 200 + i * 32);
        doc.fontSize(12).text(`${obj.paymentMethod}`, 550, 200 + i * 32);
      });
      doc.moveTo(50, 170).lineTo(700, 170).stroke();

      doc.end();

      return res.status(200).json({ success: true, data: result });
    })
    .catch((error) => {
      return next(new ErrorResponse(error.message));
    });
};

exports.getInvoiceByIdForReport = (req, res, next) => {
  InvoiceSchema.findOne({ _id: req.params.id })
  .then((result) => {
    const name = "invoice Report" + new Date().getTime() + ".pdf";
    const filePath = path.join(__dirname, "..", "files", name);
    const doc = new PDFDocument({ size: "A3", margin: 20 });
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(16).text("CMS", 50, 50);
    doc.fontSize(16).text("Invoice Report", 50, 50, { align: "center" });
    // table header
    doc.fontSize(13).text("Created At", 50, 150);

    doc.fontSize(13).text("ID", 250, 150);
    doc.fontSize(13).text("Status", 350, 150);
    doc.fontSize(13).text("Total", 450, 150);
    doc.fontSize(13).text("Payment Method", 550, 150);

      doc
        .fontSize(12)
        .text(
          `${result.createdAt.toLocaleDateString()} ${result.createdAt.toLocaleTimeString()}`,
          50,
          200 
        );
      doc.fontSize(12).text(`${result._id}`, 250, 200 );
      doc.fontSize(12).text(`${result.status}`, 350, 200 );
      doc.fontSize(12).text(`${result.total}`, 450, 200 );
      doc.fontSize(12).text(`${result.paymentMethod}`, 550, 200 );
   
    doc.moveTo(50, 170).lineTo(700, 170).stroke();

    doc.end();

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
