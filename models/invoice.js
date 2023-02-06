const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const schema = new mongoose.Schema(
  {
    patientId: { type: Number, ref: "patients" },
    doctorId: {
      type: Number,
      ref: "doctor",
    },

    status: {
      type: String,
      enum: ["incomplete", "failed", "success"],
    },
    total: {
      type: Number,
      required: true,
    },
    paymentMethod: { type: String, enum: ["cash", "visa"] },
  },
  { _id: false }
);
schema.plugin(AutoIncrement, { id: "invoice_id_counter", inc_field: "_id" });
mongoose.model("invoice", schema);
