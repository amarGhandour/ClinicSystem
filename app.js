const express = require("express");
const morgan = require("morgan");
const authMW = require("./middlewares/authMW");

require("dotenv").config({ path: "./config/.env" });
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error");
const ErrorResponse = require("./utils/ErrorResponse");

const patientRoute = require("./routes/patientsRoute");
const authRoute = require("./routes/authRoute");
const medicineRoute = require("./routes/medicineRoute");

const server = express();

let port = process.env.PORT || 8080;
connectDB()
  .then((res) => {
    server.listen(port, () => {
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
server.use("/api/v1/medicines", medicineRoute);
server.use("/api/v1/auth", authRoute);

server.use(authMW);
server.use("/api/v1/patients", patientRoute);

server.use((request, response, next) => {
  next(new ErrorResponse("Not found", 404));
});

server.use(errorHandler);
