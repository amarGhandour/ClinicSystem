const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const AutoIncrementFactory = require('mongoose-sequence')(mongoose);
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const patientSchema = new Schema({
    _id: {
        type: Number,
    },
    name: {
        type: String,
        required: [true, 'Please add name.']
    },
    email: {
        type: String,
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email address.',
        ],
        required: [true, 'Please enter Email Address'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Please add password.'],
        select: false,
        minLength: 6,
    },
    age: {
        type: Number,
        required: [true, 'Please add age.'],

    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }

});

patientSchema.plugin(AutoIncrementFactory, {id: "patient_id_counter", inc_field: "_id"});

patientSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

patientSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({id: this._id, role: 'patient'}, process.env.SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

patientSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

mongoose.model("patients", patientSchema);