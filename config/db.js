const mongoose = require("mongoose");
require('dotenv').config({path: './config/.env'});

mongoose.set('strictQuery', true);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL)
        console.log(`DB connected: ${conn.connection.host}`);
        return conn;
    } catch (err) {
        throw err
    }
}

module.exports = connectDB;
