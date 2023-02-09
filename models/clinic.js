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

    location: {
      type: {
        city: { type: String, required: true },
        street: { type: String, required: true },
        buildingNumber: { type: Number, required: true },
      },
    },
    phone: {
      type: String,
      match: /^01[0125][0-9]{8}$/,
      required: true,
    },
    email: {
      type: String,
      match: [
        /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
        "Please fill a valid email address",
      ],
    },

    description: {
      type: String,
    },

    services: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
  },
  { _id: false }
);

clinicSchema.plugin(AutoIncrement, {
  id: "clinicAutoIncrement",
  inc_field: "_id",
});
module.exports = mongoose.model("clinic", clinicSchema);
