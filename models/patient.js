const mongoose = require('mongoose');
const AutoIncrementFactory = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const patientSchema = new Schema({
    _id: {
        type: Number,
        required: true,
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
        required: [true, 'Please add password'],
        select: false,
        minLength: 6,
    },
    age: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }

});

patientSchema.plugin(AutoIncrementFactory, {id: "patient_id_counter", inc_field: "_id"});

mongoose.model("patients", patientSchema);