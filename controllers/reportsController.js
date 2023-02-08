const { mongoose } = require("mongoose");
const doc = require("pdfkit");
const InvoiceSchema = mongoose.model("invoices");
const ErrorResponse = require("../utils/ErrorResponse");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
//const report  =require('services/createReport.js');

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
      const name = 'invoice Report' + new Date().getTime() + '.pdf';

      const filePath = path.join(__dirname, '..', 'files', name);
     const doc = new PDFDocument({ size: 'A3', margin: 20 });
      doc.pipe(fs.createWriteStream(filePath));
    
     // generateHeader(doc);
      //logo 
      doc.fontSize(16).text('CMS', 50, 50);
      doc.fontSize(16).text('Invoice Report', 50, 50, { align: 'center' });
// table header
doc.fontSize(13).text("Created At", 50, 150);
doc.fontSize(13).text("ID", 250, 150);
doc.fontSize(13).text("Status", 350, 150);
doc.fontSize(13).text("Total", 450, 150);
doc.fontSize(13).text("Payment Method", 550, 150);

result.forEach(function (obj, i) {
  doc.fontSize(12).text(`${obj.createdAt.toLocaleDateString()} ${obj.createdAt.toLocaleTimeString()}`, 50, 240 + i * 32);
  doc.fontSize(12).text(`${obj._id}`, 250, 240 + i * 32);
  doc.fontSize(12).text(`${obj.status}`, 350, 240 + i * 32);
  doc.fontSize(12).text(`${obj.total}`, 450, 240 + i * 32);
  doc.fontSize(12).text(`${obj.paymentMethod}`, 550, 240 + i * 32);

});
doc.moveTo(50, 170).lineTo(700, 170).stroke();
   
      doc.end();
    
    return res.status(200).json({ success: true, data: result });
  })
  .catch((error) => {
    return next(new ErrorResponse(error.message));
  });
    // function generateHeader(doc) {
     
    
    // }

  //*view engine >> res.render("index", { result: result });


  //* JSPDF
  /*const doc = new jsPDF(
        {
        orientation: "p",
        unit: "mm",
        format: "a4",
      }
      );

      doc.setFontSize(18);
     
      
      // doc.text(result, 100, 100);
      result.forEach(function (obj, i) {
        doc.text(
          20,
          5 + i * 5,

          "createdAt:" + obj.createdAt + 
          "ID: " + obj._id+
          "Status: " +
          obj.status +
          "Total: " +
          obj.total +
          "paymentMethod: " +
           obj.paymentMethod,  
         
      )}, );
      
      doc.save("InvoiceReport.pdf");*/

  // doc.save("InvoiceReport.pdf");
  // return res.send("File uploaded successfully");

  /*  const doc = new PDFDocument();
      // doc.pipe(fs.createWriteStream('InvoiceReport5.pdf'));
      // doc.pipe(res);
      // doc.text('This the Invoices Report ', 100, 100).fontSize(25);
      // doc.scale(0.6).translate(470, -380).path('M 250,75 L 323,301 131,161 369,161 177,301 z').fill('red', 'even-odd').restore();
      // doc.end();*/

  /* doc.fontSize(27)
      // .text(result,100, 100);
      //('This the InvoicesReport ', 100, 100);

      // doc
      // .scale(0.6)
      // .translate(470, -380)
      // .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
      // .fill('red', 'even-odd')
      // .restore();*/
  // res.status(200).json({ success: true, data: result });*/

  exports.getInvoiceByIdForReport = (request, response, next) => {
    InvoiceSchema.findOne({ _id: request.params.id })
      .then((result) => {
        if (result)
          // res.render("index", { result: [result] });
          response.status(200).json({
            success: true,
            data: result,
          });
        else {
          next(new ErrorResponse("Invoice does not exist", 403));
        }
      })
      .catch((error) => next(error));
  };
};
// doc.pipe(fs.createWriteStream('InvoiceReport.pdf'));
// doc

// .fontSize(27)
// .text('This the InvoicesReport ', 100, 100);

// Adding an image in the pdf.

// doc.image('download3.jpg', {
//   fit: [300, 300],
//   align: 'center',
//   valign: 'center'
// });

// doc
// .addPage()
// .fontSize(15)
// .text('Generating PDF with the help of pdfkit', 100, 100);

// Apply some transforms and render an SVG path with the
// 'even-odd' fill rule
// doc
//   .scale(0.6)
//   .translate(470, -380)
//   .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
//   .fill('red', 'even-odd')
//   .restore();

// Add some text with annotations
// doc
//   .addPage()
//   .fillColor('blue')
//   .text('The link for GeeksforGeeks website', 100, 100)

//   .link(100, 100, 160, 27, 'https://www.geeksforgeeks.org/');

// Finalize PDF file
// doc.end();

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
