const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/ErrorResponse");
const {request, response} = require("express");

module.exports = (request, response, next) => {

    try {
        let token = request.get("Authorization").split(" ")[1];
        let decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        request.id = decodedToken.id;
        request.role = decodedToken.role;
    } catch (err) {
        next(new ErrorResponse('Not Authorized', 401));
    }
    next();
}

module.exports.authorize = (...roles) => {
    return (request, response, next) => {
        if (!roles.includes(request.role)) {
            return next(new ErrorResponse('You are not authorized.', 403));
        }
        next();
    }
}
