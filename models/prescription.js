const { mongoose, mongo } = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);
const drugschema =new mongoose.Schema({
    drug: { type: String, ref: "medicine", required: true },
    details: { type: String},
 },
 {
    _id: false
 })
const prescriptionschema = new mongoose.Schema({
    _id: Number,
    drugs:[drugschema],
    doctorId: { type: Number, ref: "doctors", required: true },
    patientId: { type: Number, ref: "patients", required: true },
    clinicId: { type: Number, ref: "clinic", required: true },
    createdAt: {type: Date, default: Date.now()}
   
}, { _id: false });

prescriptionschema.plugin(autoIncrement, { id: "prescription_id_counter", inc_field: "_id" });
module.exports = mongoose.model("prescriptions", prescriptionschema)