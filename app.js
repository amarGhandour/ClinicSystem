const express = require("express");
const morgan = require("morgan");
const authMW = require("./middlewares/authMW");
//
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express");
const options = require('./swagger');
//
const {init} = require("./utils/io");
const cors = require('cors');

require("dotenv").config({path: "./config/.env"});
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error");
const ErrorResponse = require("./utils/ErrorResponse");

const patientRoute = require("./routes/patientsRoute");
const authRoute = require("./routes/authRoute");
const medicineRoute = require("./routes/medicineRoute");
const clinicRoute = require("./routes/clinicRoute");
const reportRoute = require("./routes/reportsRoute");
const employeeRoute = require("./routes/employee");
const doctorRoute = require("./routes/doctorRoute");
const prescriptionRoute = require("./routes/prescriptionRoute");
const invoiceRoute = require("./routes/invoiceRoute");
const bookingRoute = require("./routes/bookingRoute");
const appointmentRoute = require("./routes/appointmentRoute");
const reviewsRoute = require("./routes/reviewsRoute");
const server = express();


//
const specs = swaggerJsdoc(options);
server.use(
    "/CMS-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
)
//
const app = require('http').createServer(server);
server.use(cors());
server.use(express.json());

let port = process.env.PORT || 8080;
const io = init(app);
connectDB()
    .then((res) => {
        app.listen(port, () => {
            console.log("I am listening........", port);
    });
  })
  .catch((err) => console.log(`error: ${err.message}`));

// logger
server.use(
    morgan(":method :url :status :res[content-length] - :response-time ms")
);
server.use(express.json());

// routes
server.use("/api/v1/auth", authRoute);

server.use(authMW);
server.use("/api/v1/clinics", clinicRoute);
server.use("/api/v1/medicines", medicineRoute);
server.use("/api/v1/doctors", doctorRoute);
server.use("/api/v1/prescriptions", prescriptionRoute);
server.use("/api/v1/appointments", appointmentRoute);
server.use("/api/v1/booking", bookingRoute);
server.use("/api/v1/patients", patientRoute);
server.use("/api/v1/employees", employeeRoute);
server.use("/api/v1/patients", patientRoute);
server.use("/api/v1/invoices", invoiceRoute);
server.use("/api/v1/reviews", reviewsRoute);
server.use("/api/v1/reports", reportRoute)

server.use((request, response, next) => {
    next(new ErrorResponse("Not found", 404));
});

server.use(errorHandler);
