const { mongoose } = require("mongoose");
const InvoiceSchema = mongoose.model("invoices");
const PDFDocument = require("pdfkit");
const fs = require("fs");
// let fileBuffered = "";
//const { jsPDF } = require("jspdf");

const ErrorResponse = require("../utils/ErrorResponse");

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
      //console.log(result);
      //const invoiceName='invoice-'+Date.now()+'.pdf';
      //* PDF Kit
      const doc = new PDFDocument({ size: 'A4' });
      // res.setHeader("Content-Type", "application/pdf");
      // res.setHeader('Content-Disposition',
      // 'inline; filename=InvoiceReport5.pdf');
    
      doc.pipe(fs.createWriteStream('InvoiceReport5.pdf'));
      // result is an array of objects
     result.forEach(result => {

      doc.text(`created AT: ${result.createdAt}`);
      doc.text(`ID: ${result._id}`);
      doc.text(`Status: ${result.status}`);
      doc.text(`Total: ${result.total}`);
      doc.text(`paymentMethod: ${result.paymentMethod}`);
     
     });

     /* doc.text(`created AT: ${result.createdAt}`);
      doc.text(`ID: ${result._id}`);
      doc.text(`Status: ${result.status}`);
      doc.text(`Total: ${result.total}`);
      doc.text(`paymentMethod: ${result.paymentMethod}`);
      doc.fontSize(25);
      doc.pipe(res);*/
     // doc.text('This the Invoices Report ', 100, 100).fontSize(25);
      doc.scale(0.6).translate(470, -380).path('M 250,75 L 323,301 131,161 369,161 177,301 z').fill('red', 'even-odd').restore();
    //Error : Failed to load PDF file.
    doc.end();
    return res.status(200).json({ success: true, data: result });
  })
  .catch((error) => {
    return next(new ErrorResponse(error.message));
  });
      
      //* JSPDF

     /* const doc = new jsPDF({
        
        orientation: "portrait",
        unit: "in",
        format: [10, 10]
      
      });

  
       //doc.text(result, 100, 100);
      result.forEach(function (obj, i) {
        doc.text(
          10,
          5 + i * 5,

          "createdAt:" +
            obj.createdAt +
            "ID:" +
            obj._id +
            "Status:" +
            obj.status +
            "Total:" +
            obj.total +
            "paymentMethod:" +
            obj.paymentMethod
        );
      });
      doc.setFontSize(25);
      doc.setTextColor('blue');
      let data = doc.output();
      //doc.save("InvoiceReport.pdf");
      fs.writeFileSync('../InvoiceReport.pdf', data, 'binary');*/
    
  //console.log(result);

  //*view engine >> res.render("index", { result: result });

  //*PDF Kit

  /*const doc = new PDFDocument({ size: 'A4' });

      doc.pipe(fs.createWriteStream('InvoiceReport5.pdf'));
      doc.pipe(result);
     // doc.text('This the Invoices Report ', 100, 100).fontSize(25);
      doc.scale(0.6).translate(470, -380).path('M 250,75 L 323,301 131,161 369,161 177,301 z').fill('red', 'even-odd').restore();
      doc.end();
      const file = `data:application/pdf;base64, ${Buffer.from(fileBuffered).toString("base64")}`;
      res.setHeader("Content-Type", "application/pdf");
    res.status(200).json({ success: true, data: result });
  })
  .catch((error) => {
    next(new ErrorResponse(error.message));
  });
};*/
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
