const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);
const clinicServicesSchema = new Schema(
    {
        _id: Number,
        name: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        // phone: {
        //   type: Number,
        // },
        email: {
            type: String,
        },
        website: {
            type: String,
        },
        description: {
            type: String,
        },
        services: {
            type: String,
        },
        hours: {
            type: Number,
        },
        // appointments: [
        //   {
        //     type: Number
        //   }],

    },
    {_id: false}
);

clinicServicesSchema.plugin(AutoIncrement, {inc_field: "_id"});
module.exports = mongoose.model("services", clinicServicesSchema);
