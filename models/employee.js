const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add name."],
    },
    mobileNumber: {
      type: String,
      match: /^(010|012|015)-\d{8}$/,
    },

    clinic: { type: Number, ref: "clinic" },
    salary: {
      type: Number,
      required: true,
      minimum: 3000,
      maximum: 5000,
    },
    email: {
      type: String,
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please add a valid email address.",
      ],
      required: [true, "Please enter Email Address"],
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    age: {
      type: Number,
      minimum: 25,
      maximum: 60,
    },
    activate: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { _id: false }
);
schema.plugin(AutoIncrement, { id: "employee_id_counter", inc_field: "_id" });

schema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

schema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: "employee" }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

schema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

mongoose.model("employee", schema);
