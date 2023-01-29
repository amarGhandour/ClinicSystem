const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();

const server = express();

let port = process.env.PORT || 8080;

mongoose.set('strictQuery', true);
const db = mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log("DB Connected");
        server.listen(port, () => {
            console.log("I am listening........", port);
        });
    }).catch((err) => {
        console.log("DB problem" + err);
    });













