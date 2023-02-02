const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const schema = new mongoose.Schema(
  {
    drugName: { type: String, required: true, unique: true },
    drugQuantity: {
      type: Number,
      required: true,
    },

    productionDate: {
      type: Date,
      required: true,
    },
    expireDate: {
      type: Date,
      required: true,
    },
    pricePerUnit: { type: Number, required: true },
  },
  { _id: false }
);
schema.plugin(AutoIncrement, { id: "medicine_id_counter", inc_field: "_id" });
mongoose.model("medicine", schema);
