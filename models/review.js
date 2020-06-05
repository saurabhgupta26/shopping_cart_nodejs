var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
    review: {
    type: String,
    required : true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product : {
        type: Schema.Types.ObjectId,
        ref: "Product"
    },
    rating : {
        type: Number,
        min: 0,
        max: 5,
        default:3
    }

}, {timestamps: true});

module.exports = mongoose.model("Review", reviewSchema);