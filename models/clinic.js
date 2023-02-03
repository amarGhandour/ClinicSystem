const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);
const clinicSchema = new Schema(
  {
       _id: Number,
    name: {
      type: String,
      required: true,
    },

    location: [{ type: String }],
    phone: {
      type: String,
      match : /^01[0125][0-9]{8}$/,
    },
    email: {
      type: String,
    },

    description: {
      type: String,
    
    },
    
    services: [{ type: Number, ref: "services"}],
  },
   {_id: false}
);

clinicSchema.plugin(AutoIncrement, {id: "clinicAutoIncrement",inc_field: "_id"});
module.exports = mongoose.model("clinic", clinicSchema);
