const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const schema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  name: {
    type: String,
    required: [true, "Please add name."],
  },
  specilization: {type: String, required: true},
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
  password: {
    type: String,
    required: [true, "Please add password."],
    select: false,
    minLength: 6,
  },
  clinics: [{ type: Number, ref: "clinic" }],
  age: {
    type: Number,
    required: [true, "Please add age."],
  },
  schedule: [
    {
      clinic: {
        type: Number,
        required: true,
        ref: "clinic",
      },
      timeline: {
        day: { type: String, required: true },
        startDay: { type: Number, min: 8, max: 24, required: true },
        endDay: { type: Number, min: 8, max: 24, required: true },
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

schema.plugin(AutoIncrement, { id: "doctors_id_counter", inc_field: "_id" });

schema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

schema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: "doctor" }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

schema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

mongoose.model("doctors", schema);
