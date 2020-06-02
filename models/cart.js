var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    product: {
        type: Schema.Types.ObjectId,
        ref: "Product"
    },

    quantity : {
        type: Number,
        min: 0,
        default: 0
    }
}, {timestamps: true});

module.exports = mongoose.model("Cart", cartSchema);