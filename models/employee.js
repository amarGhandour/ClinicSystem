const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add name.']
        },
        mobileNumber: {
            type: String,
            match: /^(010|012|015)-\d{8}$/,
        },

        clinic: {type: Number, ref: "clinic"},
        salary: {
            type: Number,
            required: true,
            minimum: 3000,
            maximum: 5000,
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
        password: {type: String, required: true},
        age: {
            type: Number,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        }
    },
    {_id: false}
);
schema.plugin(AutoIncrement, {id: "employee_id_counter", inc_field: "_id"});
mongoose.model("employee", schema);
