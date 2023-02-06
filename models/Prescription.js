const { mongoose, mongo } = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);
const drugschema =new mongoose.Schema({
    drug:[ { type: Number, ref: "medicine", required: true }],
    details: { type: String},
 },
 {
    _id: false
 })
const prescriptionschema = new mongoose.Schema({
    _id: Number,
    drugs:[drugschema],
    doctorId: { type: Number, ref: "doctor", required: true },
    patientId: { type: Number, ref: "patient", required: true },
    clinicId: { type: Number, ref: "clinic", required: true },
    createdAt: { type: String, required: true }
   
}, { _id: false });

prescriptionschema.plugin(autoIncrement, { id: "prescription_id_counter", inc_field: "_id" });
module.exports = mongoose.model("prescriptions", prescriptionschema)