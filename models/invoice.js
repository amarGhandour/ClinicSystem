const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const schema = new mongoose.Schema(
    {
        patientId: {type: Number, ref: "patients"},
        doctorId: {
            type: Number,
            ref: "doctors",
        },
        status: {
            type: String,
            enum: ["incomplete", "failed", "success"],
        },
        description: {
            type: String
        },
        total: {
            type: Number,
            required: true,
        },
        paymentMethod: {type: String, enum: ["cash", "Credit Card", "Insurance Card"]},
        createdAt: {
            type: Date,
            default: Date.now(),
        },
    },
    {_id: false}
);
schema.plugin(AutoIncrement, {id: "invoice_id_counter", inc_field: "_id"});
mongoose.model("invoices", schema);
