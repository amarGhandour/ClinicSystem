const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Schema = mongoose.Schema;
const schema = new Schema(
  {
    _id: {
        type: Number,
    },
    clinic: {
        type: Number,
        ref: "clinic"
      }
      ,
      doctor: {
        type: Number,
        ref: "doctors"
      },
      patient: {
        type: Number,
        ref: "patients"
      },
      //simple u can push date with time in one timestamps
      createdAt: {
        type: Date,
        default: Date.now(),
      },
      payment: {
        type:String,
        enum: ['cash', 'visa'],
        default: 'cash',
      },
      day :{
        type:String,
        required:true
      }
    });

    schema.plugin(AutoIncrement, {id: "appointmentAutoIncrement",inc_field: "_id"});
module.exports = mongoose.model("appointment", schema);
