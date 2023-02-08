
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function createReportForAllInvoices(result){
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
}

function createReportForInvoiveById(result){
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
}


module.exports = {createReportForAllInvoices, createReportForInvoiveById};