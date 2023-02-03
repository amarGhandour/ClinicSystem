const mongoose = require("mongoose");
const servicesSchema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);
const serviceSchema = new servicesSchema(
  {
      _id: Number,
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      // required: true,
    },

    clinic: [{ type: Number, ref: "clinic"}],
  },
  {_id: false}
);
serviceSchema.plugin(AutoIncrement, {id: "serviceAutoIncrement", inc_field: "_id"});
module.exports = mongoose.model("services", serviceSchema);
