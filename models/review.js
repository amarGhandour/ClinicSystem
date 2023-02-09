const mongoose = require('mongoose');
const AutoIncrement = require("mongoose-sequence")(mongoose);

const schema = new mongoose.Schema({
    _id: {
        type: Number
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title for the review'],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, 'Please add some text']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please add a rating between 1 and 10']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    doctor: {
        type: Number,
        ref: 'doctors',
        required: true
    },
    patient: {
        type: Number,
        ref: 'patients',
        required: true
    }
});


// Prevent user from submitting more than one review per bootcamp
schema.index({doctor: 1, patient: 1}, {unique: true});


schema.plugin(AutoIncrement, {id: "reviewAutoIncrement", inc_field: "_id"});

schema.statics.getAverageRating = async function (doctorId) {
    const obj = await this.aggregate([
        {
            $match: {doctor: doctorId}
        },
        {
            $group: {
                _id: '$doctor',
                averageRating: {$avg: '$rating'}
            }
        }
    ]);  // the  obj have the doctor id  and Avg Rating

    // let doc =await this.model("doctors").findByIdAndUpdate(doctorId)
    // console.log(doc)
    try {
        if (obj[0]) {
            await this.model("doctors").findByIdAndUpdate(doctorId, {
                averageRating: obj[0].averageRating.toFixed(1),
            });
        } else {
            await this.model("doctors").findByIdAndUpdate(doctorId, {
                averageRating: undefined,
            });
        }
    } catch (err) {
        console.error(err);
    }

};

// Call getAverageCost after save
schema.post('save', async function () {
    await this.constructor.getAverageRating(this.doctor);
});

// Call getAverageCost before remove
schema.post('remove', async function () {
    await this.constructor.getAverageRating(this.doctor);
});


module.exports = mongoose.model('reviews', schema);
