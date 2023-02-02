const { response, request } = require("express");

const errorHandler = async (error, request, response, next) => {
  response.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
