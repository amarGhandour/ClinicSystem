const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const schema = new mongoose.Schema(
  {
    empName: { type: String, required: true },
    mobileNumber: {
      type: String,
      required: true,
      match: /^(010|012|015)-\d{8}$/,
    },

    clinic: { type: Number, ref: "clinic" },
    salary: {
      type: Number,
      required: true,
      minimum: 3000,
      maximum: 5000,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
  },
  { _id: false }
);
schema.plugin(AutoIncrement, { id: "employee_id_counter", inc_field: "_id" });
mongoose.model("employee", schema);
