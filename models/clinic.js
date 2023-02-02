const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//const AutoIncrement = require("mongoose-sequence")(mongoose);
const clinicSchema = new Schema(
  {
    //   _id: Number,
    name: {
      type: String,
      required: true,
    },

    location: [{ type: String }],
    phone: {
      type: String,
    },
    email: {
      type: String,
    },

    description: {
      type: String,
    },

    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "services" }],
  }
  // {_id: false}
);

//clinicSchema.plugin(AutoIncrement, {inc_field: "_id"});
module.exports = mongoose.model("clinic", clinicSchema);
